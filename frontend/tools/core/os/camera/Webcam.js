export class Webcam {

	static stream = null

	static async enable() {
		this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
	}

	static get enabled() {
		return (this.stream != null)
	}

	static async request({ ok, error } = {}) {
		try {
			await this.enable()
			this.stream.getTracks().forEach(track => track.stop())

			console.log("Camera permission granted (then closed).")
			ok()
		}
		catch (e) {
			console.error("permission denied or error:", e)
			error(e)
			throw new Error("camera denied")
		}
	}

	static routeTo(video) {
		video.sourceObject = this.stream
	}
}

