export class Mic {
	static stream = null
	static source = null

	static get recording() {
		Assert.true(Permission.granted)
		return _MicRecorder.state == "recording"
	}

	static get idle() {
		Assert.true(Permission.granted)
		return _MicRecorder.state == "idle"
	}

	static get deviceId() {
		Assert.true(Permission.granted)
		// undefined needs to be used instead of null because of getUserMedia api
		return localStorage.getItem("mic_deviceId") ?? undefined
	}

	static set deviceId(id) {
		Assert.true(Permission.granted)
		localStorage.setItem("mic_deviceId", id)
	}

	static async startRecording(onStart = () => {}) {
		return _MicRecorder.start(this.deviceId, onStart)
	}

	static async stopRecording(onStop = () => {}) {
		return _MicRecorder.stop(onStop)
	}

	static async all() {
		Assert.true(Permission.granted)

		const devices = await navigator.mediaDevices.enumerateDevices()
		return devices.filter(device => device.kind == "audioinput")
	}

	static async enable() {
		Assert.true(Permission.granted)
		if !this.source || !this.stream?.active {
			this.stream = await MediaDevices.audio(this.deviceId)
			this.source = SoundContext.context.createMediaStreamSource(this.stream)
		}

		return this.source
	}

	static disable() {
		this.source?.disconnect()
		this.stream?.getTracks().forEach(track => track.stop())
		this.source = null
		this.stream = null
	}

}
