
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

	static async start(mimeType, userId, revision) {
		if this.p {
			throw new Error("already running")
		}
		if mimeType != "webm" {
			throw new Error("FFMPEG: unsupported mimeType: " + mimeType)
		}

		this.p = Spawn("ffmpeg", [
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

			"-hls_segment_filename",
			`public_folder/hls/${userId}-${revision}-%d.ts`,
			"public_folder/hls/output.m3u8"
		])

		await this.p.waitForSpawn()
	}

	static async stop() {
		if this.p {
			const child = this.p
			this.p = null
			await child.stop()
		}
		else {
			throw new Error("can't trigger stop as no process is running")
		}

	}

	static write(buffer) {
		if this.p {
			return this.p.write(buffer)
		}
		else {
			throw new Error("FFmpeg is not running")
		}

	}

}
