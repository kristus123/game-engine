export class Cam {

	static permissionGiven = false
	static stream = null

	static async enable() {
		Assert.true(this.permissionGiven)

		this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
	}

	static disable() {
		Assert.true(this.permissionGiven)

		this.stream.getTracks().forEach(track => track.stop())
		this.stream = null
	}

	static async request({ ok, error } = {}) {
		Assert.false(this.permissionGiven)

		try {
			await this.enable()
			this.disable()

			console.log("Camera permission granted (then closed).")
			ok()
			this.permissionGiven = true
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
		Assert.true(this.permissionGiven)

		const devices = await navigator.mediaDevices.enumerateDevices()
		return devices.filter(device => device.kind == "videoinput")
	}
}
