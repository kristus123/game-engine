export class Cam {

	static stream = null

	static async enable() {
		Assert.true(Permission.granted)

		this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
	}

	static disable() {
		Assert.true(Permission.granted)

		this.stream.getTracks().forEach(track => track.stop())
		this.stream = null
	}

	static routeTo(video) {
		Assert.value(this.stream)

		video.sourceObject = this.stream
	}

	static async all() {
		Assert.true(Permission.granted)

		const devices = await navigator.mediaDevices.enumerateDevices()
		return devices.filter(device => device.kind == "videoinput")
	}
}
