export class NewSpeakerListener {

	static connectedListener = Listener()
	static disconnectedListener = Listener()

	static onConnect(callback) {
		this.connectedListener.listen(callback)
	}

	static onDisconnect(callback) {
		this.disconnectedListener.listen(callback)
	}

	static async init() {
		if (!MicPermission.granted) { //mic permission is need for the web API navigator.mediaDevices.enumerateDevices() to return name of the speakers, otherwise it returns empty name
			throw new Error("x")
		}

		let last = await AllSpeakers.get()
		for (const speaker of last) {
			NewSpeakerListener.connectedListener.trigger(speaker)
		}

		navigator.mediaDevices.addEventListener("devicechange", Debounce(200, async () => {

			const current = await AllSpeakers.get()

			for (const speaker of current) {
				if (!last.some(d => d.deviceId == speaker.deviceId)) {
					NewSpeakerListener.connectedListener.trigger(speaker)
					console.log("connected", speaker)
				}
			}

			for (const speaker of last) {
				if (!current.some(d => d.deviceId == speaker.deviceId)) {
					console.log("disconnected", speaker)
					NewSpeakerListener.disconnectedListener.trigger(speaker)
				}
			}

			last = current
		}))
	}
}