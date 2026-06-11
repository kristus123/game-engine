export class NewMicListener {

	static async init() {

		let last = await AllMics.get()

		navigator.mediaDevices.addEventListener("devicechange", Debounce(200, async () => {

			const current = await AllMics.get()

			for (const mic of current) {
				if (!last.some(d => d.deviceId == mic.deviceId)) {
					console.log("connected", mic)
				}
			}

			for (const mic of last) {
				if (!current.some(d => d.deviceId == mic.deviceId)) {
					console.log("disconnected", mic)
				}
			}

			last = current
		}))
	}
}
