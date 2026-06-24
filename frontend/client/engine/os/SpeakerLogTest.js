export class SpeakerLogTest {

	static testUrl = "/client/game/audio/click.mp3"

	static async run() {
		console.log("[SpeakerLogTest] start")
		console.log("[SpeakerLogTest] active speaker deviceId:", Speaker.active)
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

		NewMicListener.onConnect((device) => {
			console.log("[SpeakerLogTest] 🎙️ Mic Connected:", device.label, device.deviceId)
		})

		NewMicListener.onDisconnect((device) => {
			console.log("[SpeakerLogTest] ❌ Mic Disconnected:", device.label, device.deviceId)
		})

		// 3. Initialize the listeners to kick off current state tracking
		try {
			await NewSpeakerListener.init()
			await NewMicListener.init()
			console.log("[SpeakerLogTest] Device listeners initialized successfully.")
		} catch (error) {
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

		console.log("[SpeakerLogTest] click anywhere to play click.mp3 on each speaker sequence")

		const previousOnClick = Mouse.onClick
		Mouse.onClick = async (...args) => {
			Mouse.onClick = previousOnClick
			await this.playOnAllSpeakers(speakers)
			previousOnClick?.(...args)
		}
	}

	static async playOnAllSpeakers(speakers) {
		for (const speaker of speakers) {
			console.log("[SpeakerLogTest] setting Speaker.active to", speaker.deviceId)
			Speaker.active = speaker.deviceId 

			console.log("[SpeakerLogTest] playing on", speaker.label || "(no label)", speaker.deviceId)
			await this.playOnSpeaker()
		}
		console.log("[SpeakerLogTest] done loop sequence")
	}

	static playOnSpeaker() {
		return new Promise(async (resolve, reject) => {
			const audio = await SpeakerApi.createAudio(this.testUrl)
			audio.onended = () => resolve()
			audio.onerror = e => reject(e)
			audio.play().catch(reject)
		})
	}

}