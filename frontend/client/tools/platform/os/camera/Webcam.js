export class Webcam {

	static stream = null

	static async enable() {
		this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
	}

	static get enabled() {
		return (Webcam.stream != null)
	}

	static async request(callback) {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true }, { audio: false })

			stream.getTracks().forEach(track => track.stop())

			console.log("Camera permission granted (then closed).")
			callback(true)
		}
		catch (err) {
			console.error("Permission denied or error:", err)
			callback(false)
			throw new Error("camera denied")
		}
	}

	static routeTo(video) {
		console.log("are you thre?")
		video.sourceStream = this.stream
	}
}

