export class AllMics {

	static async get(callback) {
		const devices = await navigator.mediaDevices.enumerateDevices()

		const mics = devices
			.filter(d => d.kind == "audioinput")
			.filter(d => !(d.deviceId == "default" || d.deviceId == "communications"))

		for (const m of mics) {
			callback(m)
		}

		return mics
	}

}
