export class SpeakerLogTest {

	static testUrl = "/client/game/audio/click.mp3"

	static async run() {
		console.log("[SpeakerLogTest] start")
		console.log("[SpeakerLogTest] active speaker deviceId:", ActiveSpeaker.active)
		console.log("[SpeakerLogTest] setSinkId supported", typeof HTMLAudioElement.prototype.setSinkId == "function")

		// 1. Ensure permissions are granted before initializing listeners
		if (!MicPermission.granted) {
			console.log("[SpeakerLogTest] Requesting mic permissions first...")
			await new Promise((resolve) => MicPermission.request((granted) => resolve(granted)))
		}

		// 2. Register hot-plugging listeners (Make sure to pass valid callback functions!)
		NewSpeakerListener.onConnect((device) => {
			console.log("[SpeakerLogTest] 🔊 Speaker Connected:", device.label, device.deviceId)
		})

		NewSpeakerListener.onDisconnect((device) => {
			console.log("[SpeakerLogTest] ❌ Speaker Disconnected:", device.label, device.deviceId)
		})

		// 3. Initialize the listeners to kick off current state tracking
		try {
			await NewSpeakerListener.init()
			console.log("[SpeakerLogTest] Device listeners initialized successfully.")
		}
		catch (error) {
			console.error("[SpeakerLogTest] Failed to initialize listeners:", error)
		}

		// 4. Run existing speaker loop logic
		const speakers = await AllSpeakers.get()
		console.log("[SpeakerLogTest] speakers available:", speakers.map(s => ({
			label: s.label,
			deviceId: s.deviceId,
		})))

		if (!speakers || speakers.length === 0) {
			console.warn("[SpeakerLogTest] no speakers found")
			return
		}

		await this.playOnAllSpeakers(speakers)
	}

	static async playOnAllSpeakers(speakers) {
		for (const speaker of speakers) {
			console.log("[SpeakerLogTest] setting ActiveSpeaker.active to", speaker.deviceId)
			ActiveSpeaker.active = speaker.deviceId

			console.log("[SpeakerLogTest] playing on", speaker.label || "(no label)", speaker.deviceId)
			await this.playOnSpeaker()
		}
		console.log("[SpeakerLogTest] done loop sequence")
	}

	static playOnSpeaker() {
		return new Promise(async (resolve, reject) => {
			const audio = await ActiveSpeaker.createAudio(this.testUrl)
			audio.onended = () => resolve()
			audio.onerror = e => reject(e)
			audio.play().catch(reject)
		})
	}

}