import { execFile } from "child_process"

// -preset
// ultrafast
// superfast
// veryfast
// faster
// fast
// medium
// slow
// slower
// veryslow
// placebo

export class Ffmpeg {

	static async start(mimeType) {
		if (this.p) {
			throw new Error("already running")
		}
		if (mimeType != "webm") {
			throw new Error("FFMPEG: unsupported mimeType: " + mimeType)
		}

		this.p = new Spawn("ffmpeg", [
			"-loglevel",
			"verbose",
			"-stats",

			"-f",
			"webm",
			"-i",
			"pipe:0",

			"-fps_mode",
			"passthrough",

			"-c:v",
			"libx264",
			"-pix_fmt",
			"yuv420p",
			"-preset",
			"medium",
			"-crf",
			"16",
			"-tune",
			"zerolatency",
			"-threads",
			"0",

			"-ac",
			"1",
			"-ar",
			"48000",
			"-af",
			"highpass=f=80,arnndn=m=backend/http/endpoints/hls/std.rnnn:mix=0.4,aresample=async=1",

			"-c:a",
			"aac",
			"-b:a",
			"64k",

			"-f",
			"hls",
			"-hls_time",
			String(Config.hlsTime),
			"-hls_list_size",
			String(Config.hlsListSize),
			"-g",
			"60",
			"-keyint_min",
			"60",
			"-hls_flags",
			"delete_segments+independent_segments+program_date_time",
			"-hls_segment_type",
			"mpegts",

			"public_folder/hls/output.m3u8"
		])

		await this.p.waitForSpawn()
	}

	static runClip(args) {
		return new Promise((resolve, reject) => {
			const child = execFile("ffmpeg", args, { timeout: 120_000, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
				if (error) {
					reject(new Error(stderr || error.message))
				}
				else {
					resolve()
				}
			})
			this.clipProcesses.add(child)
			child.once("close", () => this.clipProcesses.delete(child))
		})
	}

	static async stopClipProcesses() {
		const clips = [...this.clipProcesses]
		await Promise.all(clips.map(child => {
			if (child.exitCode != null || child.signalCode != null) {
				return Promise.resolve()
			}

			return new Promise(resolve => {
				const forceKillTimeout = setTimeout(() => child.kill("SIGKILL"), 2_000)
				forceKillTimeout.unref()
				child.once("close", () => {
					clearTimeout(forceKillTimeout)
					resolve()
				})
				child.kill("SIGTERM")
			})
		}))
	}

	static clipProcesses = new Set()

	static async stop() {
		if (this.p) {
			await this.p.stop()
			this.p = null
		}
		else {
			throw new Error("can't trigger stop as no process is running")
		}

	}

	static write(buffer) {
		if (this.p) {
			return this.p.write(buffer)
		}
		else {
			throw new Error("FFmpeg is not running")
		}

	}

}
