export class DeviceListener {

	static connectListener = Listener()
	static disconnectListener = Listener()

	static onConnect(callback) {
		for (const mic of this.mics) {
			callback(mic)
		}

		this.connectListener.listen(callback)
	}

	static onDisconnect(callback) {
		this.disconnectListener.listen(callback)
	}

	static async init() {
		Assert.true(Permission.granted)

		let last = await navigator.mediaDevices.enumerateDevices()

		for (const device of last) {
			this.devices.push(device)
			this.connectListener.trigger(device)
		}

		navigator.mediaDevices.addEventListener("devicechange", Debounce(200, async () => {
			const current = await navigator.mediaDevices.enumerateDevices()

			for (const device of current) {
				if (!last.some(d => d.deviceId == device.deviceId)) {
					this.connectListener.trigger(device)
					this.devices.push(device)
				}
			}

			for (const device of last) {
				if (!current.some(d => d.deviceId == device.deviceId)) {
					this.disconnectListener.trigger(device)
					this.devices.remove(device)
				}
			}

			last = current
		}))
	}
}
