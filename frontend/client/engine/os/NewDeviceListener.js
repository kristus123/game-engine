import { Listener } from "../multiplayer/socket/client/Listener.js"
import { Debounce } from "./Debounce.js"

export class NewDeviceListener {

	constructor(getDevices) {
		this.connectedListener = new Listener()
		this.disconnectedListener = new Listener()
		this.getDevices = getDevices
		this.initialized = false
		this.deviceChangeHandler = null
	}

	onConnect(callback) {
		this.connectedListener.listen(callback)
	}

	onDisconnect(callback) {
		this.disconnectedListener.listen(callback)
	}

	async init() {
		if (this.initialized) {
			return
		}

		this.initialized = true

		let last = await this.getDevices()
		for (const device of last) {
			this.connectedListener.trigger(device)
		}

		this.deviceChangeHandler = Debounce(200, async () => {
			const current = await this.getDevices()

			for (const device of current) {
				if (!last.some(d => d.deviceId == device.deviceId)) {
					this.connectedListener.trigger(device)
				}
			}

			for (const device of last) {
				if (!current.some(d => d.deviceId == device.deviceId)) {
					this.disconnectedListener.trigger(device)
				}
			}

			last = current
		})

		if (navigator.mediaDevices?.addEventListener) {
			navigator.mediaDevices.addEventListener("devicechange", this.deviceChangeHandler)
		}
	}

}
