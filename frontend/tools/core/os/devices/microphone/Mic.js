export class Mic {

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
		return Assert.value(localStorage.getItem("mic_deviceId"))
	}

	static set deviceId(id) {
		Assert.true(Permission.granted)
		localStorage.setItem("mic_deviceId", id)
	}

	static async startRecording(onStart = () => {}) {
		return _MicRecorder.start(this.deviceId, onStart)
	}

	static async stopRecording(onStop = () => {}) {
		return _MicRecorder.stop(onstop)
	}

	static async all() {
		Assert.true(Permission.granted)

		const devices = await navigator.mediaDevices.enumerateDevices()
		return devices.filter(device => device.kind == "audioinput")
	}

}
