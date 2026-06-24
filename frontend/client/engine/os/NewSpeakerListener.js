import { NewDeviceListener } from "./NewDeviceListener.js"
import { AllSpeakers } from "./AllSpeakers.js"

export class NewSpeakerListener {

	static listener = null

	static onConnect(callback) {
		this.listener ??= this.createListener()
		this.listener.onConnect(callback)
	}

	static onDisconnect(callback) {
		this.listener ??= this.createListener()
		this.listener.onDisconnect(callback)
	}

	static async init() {
		if (!MicPermission.granted) {
			throw new Error("x")
		}

		this.listener ??= this.createListener()
		await this.listener.init()
	}

	static createListener() {
		return new NewDeviceListener(async () => AllSpeakers.get())
	}

}
