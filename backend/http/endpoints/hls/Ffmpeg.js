import { spawn } from "child_process"

export class Ffmpeg {

	static start(mimeType) {
		if (this.p) {
			throw new Error("already running")
		}

		let thingy = null
		if (mimeType == "webm") {
			thingy = "webm" // todo make it more robust
		}
		else {
			throw new Error("FFMPEG: unsupported mimeType: " + mimeType)
		}

		this.p = spawn("ffmpeg", [
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
			"delete_segments",
			"public_folder/hls/output.m3u8"
		])

		this.p.stderr.on("data", data => {
			console.log(data.toString())
		})

		this.p.on("close", (code, signal) => {
			console.log("FFmpeg exited:", code, signal)
			this.p = null
		})

		return new Promise((resolve, reject) => {
			this.p.once("spawn", () => resolve(true))
			this.p.once("error", reject)
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
		if (!this.p || this.p.stdin.destroyed) {
			throw new Error("FFmpeg is not running or smt else shit")
		}

		if (!this.p.stdin.write(buffer)) {
			await new Promise(resolve => {
				this.p.stdin.once("drain", resolve)
			})
		}
	}

}
