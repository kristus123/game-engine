export class DeviceListener {

	static mics = []
	static speakers = []

	static micConnectedListener = Listener()
	static micDisconnectedListener = Listener()

	static speakerConnectedListener = Listener()
	static speakerDisconnectedListener = Listener()

	static onMicConnect(callback) {
		for (const mic of this.mics) {
			callback(mic)
		}

		this.micConnectedListener.listen(callback)
	}

	static onMicDisconnect(callback) {
		this.micDisconnectedListener.listen(callback)
	}

	static onSpeakerConnect(callback) {
		for (const speaker of this.speakers) {
			callback(speaker)
		}

		this.speakerConnectedListener.listen(callback)
	}

	static onSpeakerDisconnect(callback) {
		this.speakerDisconnectedListener.listen(callback)
	}

	static async init() {
		let last = await navigator.mediaDevices.enumerateDevices()

		for (const device of last) {
			if (device.kind == "audioinput") {
				this.mics.push(device)
				this.micConnectedListener.trigger(device)
			}
			else if (device.kind == "audiooutput") {
				this.speakers.push(device)
				this.speakerConnectedListener.trigger(device)
			}
		}

		navigator.mediaDevices.addEventListener("devicechange", Debounce(200, async () => {
			const current = await navigator.mediaDevices.enumerateDevices()

			for (const device of current) {
				if (!last.some(d => d.deviceId == device.deviceId)) {
					if (device.kind == "audioinput") {
						this.mics.push(device)
						this.micConnectedListener.trigger(device)
					}
					else if (device.kind == "audiooutput") {
						this.speakers.push(device)
						this.speakerConnectedListener.trigger(device)
					}
				}
			}

			for (const device of last) {
				if (!current.some(d => d.deviceId == device.deviceId)) {
					if (device.kind == "audioinput") {
						this.mics.remove(device)
						this.micDisconnectedListener.trigger(device)
					}
					else if (device.kind == "audiooutput") {
						this.speakers.remove(device)
						this.speakerDisconnectedListener.trigger(device)
					}
				}
			}

			last = current
		}))
	}
}
