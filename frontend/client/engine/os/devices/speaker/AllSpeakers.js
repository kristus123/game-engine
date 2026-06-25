export class AllSpeakers {

	static async get(callback = () => {}) {
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true })
			const devices = await navigator.mediaDevices.enumerateDevices()

			const speakers = devices.filter(d =>
				d.kind === "audiooutput" &&
        d.deviceId !== "default" &&
        d.deviceId !== "communications"
			)

			if (!callback) {
				for (const m of speakers) {
					callback(m)
				}
			}

			return speakers
		}
		catch (error) {
			console.error("Error enumerating audio devices:", error)
			return []
		}
	}

}