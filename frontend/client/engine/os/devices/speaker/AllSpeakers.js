export class AllSpeakers {

	static async init() {
		NewSpeakerListener.onConnect((device) => {
			console.log("[AllSpeakers] 🔊 Speaker Connected:", device.label, device.deviceId)
		})

		NewSpeakerListener.onDisconnect(async (device) => {
			console.log("[AllSpeakers] ❌ Speaker Disconnected:", device.label, device.deviceId)
			if (ActiveSpeaker.active == device.deviceId) {
				await this.setDefaultSpeaker()
			}
		})

		await NewSpeakerListener.init()

		if (ActiveSpeaker.active == null) {
			await this.setDefaultSpeaker()
		}
		else {
			await this.setSpeaker(ActiveSpeaker.active)
		}
	}

	static async setSpeaker(preferredDeviceID) {
		const speakers = await this.get()
		const preferredSpeakerExists = speakers.some(s => s.deviceId === preferredDeviceID)

		if (preferredDeviceID && preferredSpeakerExists) {
			console.log("[AllSpeakers] Using saved speaker preference:", preferredDeviceID)
			ActiveSpeaker.active = preferredDeviceID
			await SoundContext.setSink(ActiveSpeaker.active)
		}
		else if (ActiveSpeaker.active == null || ActiveSpeaker.active == preferredDeviceID) {
			await this.setDefaultSpeaker();
		}
	}

	static async setDefaultSpeaker() {
		const speakers = await this.get()

		if (!speakers || speakers.length === 0) {
			console.warn("[AllSpeakers] no speakers found")
			return
		}
		else {
			ActiveSpeaker.active = speakers[0].deviceId
			console.log("[AllSpeakers] Defaulting to:", ActiveSpeaker.active)
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
		await this.setSpeaker(speakerDevice)
	}
}