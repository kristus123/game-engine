import assert from "node:assert/strict"
import { test } from "node:test"
import { spawnSync } from "node:child_process"
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, copyFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { TranspileContent } from "../transpiler/TranspileContent.js"

test("the HLS encoder produces 720p30 Baseline Level 3.1 with AAC and two-second keyframes", async () => {
	const folder = mkdtempSync(path.join(tmpdir(), "hls-encoding-"))
	const root = fileURLToPath(new URL("../../", import.meta.url))
	try {
		mkdirSync(path.join(folder, "public_folder/hls"), { recursive: true })
		mkdirSync(path.join(folder, "backend/http/endpoints/hls"), { recursive: true })
		copyFileSync(path.join(root, "backend/http/endpoints/hls/std.rnnn"), path.join(folder, "backend/http/endpoints/hls/std.rnnn"))
		const input = spawnSync("ffmpeg", [
			"-hide_banner",
			"-loglevel",
			"error",
			"-f",
			"lavfi",
			"-i",
			"testsrc2=size=1280x720:rate=30",
			"-f",
			"lavfi",
			"-i",
			"sine=frequency=440:sample_rate=48000",
			"-t",
			"5",
			"-c:v",
			"libvpx",
			"-deadline",
			"realtime",
			"-cpu-used",
			"8",
			"-b:v",
			"2M",
			"-c:a",
			"libopus",
			"-f",
			"webm",
			"pipe:1",
		], { maxBuffer: 20 * 1024 * 1024, timeout: 30_000 })
		assert.equal(input.status, 0, input.stderr.toString())

		// Exercise the actual production argument list, using a temporary output directory.
		const file = path.join(root, "backend/http/endpoints/hls/Ffmpeg.js")
		const source = TranspileContent(file, readFileSync(file, "utf8"), []).replace("export ", "")
		let args
		const Encoder = new Function("SuperClass", "IfCondition", "Assert", "Spawn", "Config", source + "\nreturn Ffmpeg")(
			class {}, { validate: Boolean }, { notNull: value => assert.ok(value != null) },
			(command, options) => {
				assert.equal(command, "ffmpeg")
				args = options
				return { waitForSpawn: async () => {} }
			}, { hlsTime: 2, hlsListSize: 60 },
		)
		await Encoder.start("webm", "test-user", 1)
		// Use a seekable fixture so the test can finish without live-pipe shutdown races.
		writeFileSync(path.join(folder, "input.webm"), input.stdout)
		args[args.indexOf("pipe:0")] = "input.webm"
		const encoded = spawnSync("ffmpeg", args, { cwd: folder, timeout: 30_000, maxBuffer: 4 * 1024 * 1024 })
		assert.equal(encoded.status, 0, encoded.stderr.toString())
		assert.doesNotMatch(encoded.stderr.toString(), /level limit|VBV underflow/i)
		const playlist = readFileSync(path.join(folder, "public_folder/hls/output.m3u8"), "utf8")
		const durations = [...playlist.matchAll(/#EXTINF:([\d.]+)/g)].map(match => Number(match[1]))
		assert.equal(durations.length, 3)
		assert.ok(Math.abs(durations[0] - 2) < 0.05)
		assert.ok(Math.abs(durations[1] - 2) < 0.05)
		const firstSegment = playlist.split(/\r?\n/).find(line => line && !line.startsWith("#"))
		const probe = spawnSync("ffprobe", ["-v", "error", "-show_streams", "-of", "json", path.join(folder, "public_folder/hls", firstSegment)], { timeout: 10_000 })
		assert.equal(probe.status, 0, probe.stderr.toString())
		const streams = JSON.parse(probe.stdout).streams
		const video = streams.find(stream => stream.codec_type == "video")
		const audio = streams.find(stream => stream.codec_type == "audio")
		assert.equal(video.codec_name, "h264")
		assert.equal(video.profile, "Constrained Baseline")
		assert.equal(video.level, 31)
		assert.equal(video.width, 1280)
		assert.equal(video.height, 720)
		assert.equal(video.r_frame_rate, "30/1")
		assert.equal(video.pix_fmt, "yuv420p")
		assert.equal(audio.codec_name, "aac")
		assert.equal(audio.profile, "LC")
		assert.equal(audio.sample_rate, "48000")
		assert.equal(audio.channels, 1)
	}
	finally {
		rmSync(folder, { recursive: true, force: true })
	}
})
