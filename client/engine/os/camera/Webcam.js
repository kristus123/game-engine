export class Webcam {

	static stream = null

	static enabled = false
	static granted = false

	static async enable() {
		this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
		this.enabled = true
	}

	static disable() {
		this.stream.getTracks().forEach(track => track.stop())
		this.enabled = false
	}

	static async request(callback) {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true }, { audio: true })

			stream.getTracks().forEach(track => track.stop())

			console.log("Camera permission granted (then closed).")
			callback(this.granted = true)
		}
		catch (err) {
			console.error("Permission denied or error:", err)
			callback(this.granted = false)
			throw new Error("camera denied")
		}
	}

}

