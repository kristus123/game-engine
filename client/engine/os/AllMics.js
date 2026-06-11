export class AllMics {

	static async get() {
		const devices = await navigator.mediaDevices.enumerateDevices()

		return devices
			.filter(d => d.kind == "audioinput")
			.filter(d => !(d.deviceId == "default" || d.deviceId == "communications"))
	}

}
