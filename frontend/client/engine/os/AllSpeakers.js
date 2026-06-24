export class AllSpeakers {

	static async get(callback) {
		const devices = await navigator.mediaDevices.enumerateDevices()

		const speakers = devices
			.filter(d => d.kind == "audiooutput")
			.filter(d => !(d.deviceId == "default" || d.deviceId == "communications"))

		if (typeof callback == "function") {
			for (const speaker of speakers) {
				callback(speaker)
			}
		}

		return speakers
	}

}
