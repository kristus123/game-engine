import { spawn } from "child_process"

export class Ffmpeg {

	static start(mimeType) {
		if (this.p) {
			throw new Error("already running")
		}

		let thingy = null

		if (mimeType == "webm") {
			thingy = "webm"
		}
		else {
			throw new Error("FFMPEG: unsupported mimeType: " + mimeType)
		}

		console.log("Starting FFmpeg...")

		this.p = spawn("ffmpeg", [
			"-loglevel",
			"verbose",
			"-stats",
			"-f",
			thingy,
			"-i",
			"pipe:0",
			"-c:v",
			"libx264",
			"-preset",
			"ultrafast",
			"-c:a",
			"aac",
			"-f",
			"hls",
			"-hls_time",
			"5",
			"-hls_list_size",
			"6",
			"-hls_flags",
			"delete_segments+independent_segments",
			"-hls_segment_type",
			"mpegts",
			"public_folder/hls/output.m3u8"
		])

		console.log("FFmpeg PID:", this.p.pid)

		this.p.stdout.on("data", data => {
			console.log("[FFmpeg stdout]", data.toString().trim())
		})

		this.p.stderr.on("data", data => {
			console.log("[FFmpeg stderr]", data.toString().trim())
		})

		this.p.stdin.on("error", error => {
			console.error("[FFmpeg stdin error]", error)
		})

		this.p.stdin.on("close", () => {
			console.log("FFmpeg stdin closed")
		})

		this.p.on("error", error => {
			console.error("[FFmpeg process error]", error)
		})

		this.p.on("close", (code, signal) => {
			console.log("FFmpeg exited:", { code, signal })
			this.p = null
		})

		return new Promise((resolve, reject) => {
			const process = this.p

			process.once("spawn", () => {
				console.log("FFmpeg spawned")
				resolve(true)
			})

			process.once("error", error => {
				console.error("FFmpeg failed to spawn:", error)
				reject(error)
			})
		})
	}

	static stop() {
		if (!this.p) {
			throw new Error("can't trigger stop as no process is running")
		}

		return new Promise(resolve => {
			const process = this.p

			process.once("close", () => {
				this.p = null
				resolve()
			})

			process.stdin.end()
		})
	}

	static async write(buffer) {
		if (!this.p) {
			throw new Error("FFmpeg is not running")
		}

		if (this.p.stdin.destroyed) {
			throw new Error("FFmpeg stdin is destroyed")
		}

		if (!Buffer.isBuffer(buffer)) {
			throw new Error("FFmpeg write expected a Buffer")
		}

		console.log("Writing chunk:", buffer.length)

		try {
			const ok = this.p.stdin.write(buffer)

			console.log("stdin.write:", ok)

			if (!ok) {
				console.log("Waiting for drain")

				await new Promise((resolve, reject) => {
					const onDrain = () => {
						cleanup()
						resolve()
					}

					const onError = error => {
						cleanup()
						reject(error)
					}

					const cleanup = () => {
						this.p.stdin.off("drain", onDrain)
						this.p.stdin.off("error", onError)
					}

					this.p.stdin.once("drain", onDrain)
					this.p.stdin.once("error", onError)
				})

				console.log("Drain")
			}
		}
		catch (error) {
			console.error("Failed writing chunk to FFmpeg:", error)
			throw error
		}
	}

}
