export class AllMics {

	static async get(callback = () => {}) {
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true })
			const devices = await navigator.mediaDevices.enumerateDevices()

			const mics = devices.filter(d =>
				d.kind === "audioinput" &&
        d.deviceId !== "default" &&
        d.deviceId !== "communications"
			)

			if (!callback) {
				for (const m of mics) {
					callback(m)
				}
			}

			return mics
		}
		catch (error) {
			console.error("Error enumerating audio input devices:", error)
			return []
		}
	}
}