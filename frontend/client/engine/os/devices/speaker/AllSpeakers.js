export class AllSpeakers {

	static async init() {
		await NewSpeakerListener.init()

		const speakers = await this.get()
		console.log("[AllSpeakers] speakers available:", speakers.map(s => ({
			label: s.label,
			deviceId: s.deviceId,
		})))

		if (!speakers || speakers.length === 0) {
			console.warn("[AllSpeakers] no speakers found")
			return
		}
		else {
			ActiveSpeaker.active = speakers[0].deviceId
			console.log("[AllSpeakers] setting ActiveSpeaker.active to", speakers[0].deviceId)
		}

		await SoundContext.setSink(ActiveSpeaker.active)
	}

	static async get(callback = () => { }) {
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true })
			const devices = await navigator.mediaDevices.enumerateDevices()

			const speakers = devices.filter(d =>
				d.kind === "audiooutput" &&
				d.deviceId !== "default" &&
				d.deviceId !== "communications"
			)

			for (const m of speakers) {
				callback(m)
			}

			return speakers
		}
		catch (error) {
			console.error("Error enumerating audio devices:", error)
			return []
		}
	}

	//Call this if user selects a different speaker
	static async onUserSelectSpeaker(speakerDevice) {
		ActiveSpeaker.active = speakerDevice.deviceId
		await SoundContext.setSink(speakerDevice.deviceId)
	}
}