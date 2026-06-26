export class NewMicListener {

	static connectedListener = Listener()
	static disconnectedListener = Listener()

	static onConnect(callback) {
		this.connectedListener.listen(callback)
	}

	static onDisconnect(callback) {
		this.disconnectedListener.listen(callback)
	}

	static async init() {
		if (!MicPermission.granted) {
			throw new Error ("x")
		}

		let last = await AllMics.get()
		for (const mic of last) {
			connectedListener.trigger(mic)
		}

		navigator.mediaDevices.addEventListener("devicechange", Debounce(200, async () => {

			const current = await AllMics.get()

			for (const mic of current) {
				if (!last.some(d => d.deviceId == mic.deviceId)) {
					connectedListener.trigger(mic)
					console.log("connected", mic)
				}
			}

			for (const mic of last) {
				if (!current.some(d => d.deviceId == mic.deviceId)) {
					console.log("disconnected", mic)
					disconnectedListener.trigger(mic)
				}
			}

			last = current
		}))
	}
}
