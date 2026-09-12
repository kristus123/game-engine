export class Cam {

	static granted = false
	static stream = null

	static async enable() {
		Assert.true(this.granted)

		this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
	}

	static disable() {
		Assert.true(this.granted)

		this.stream.getTracks().forEach(track => track.stop())
		this.stream = null
	}

	static async request({ ok, error } = {}) {
		Assert.false(this.granted)

		try {
			await this.enable()
			this.disable()

			console.log("Camera permission granted (then closed).")
			ok()
			this.granted = true
		}
		catch (e) {
			console.error("permission denied or error:", e)
			error(e)
			throw new Error("camera permission denied")
		}
	}

	static routeTo(video) {
		Assert.value(this.stream)

		video.sourceObject = this.stream
	}

	static async all() {
		Assert.true(this.granted)

		const devices = await navigator.mediaDevices.enumerateDevices()
		return devices.filter(device => device.kind == "videoinput")
	}
}
