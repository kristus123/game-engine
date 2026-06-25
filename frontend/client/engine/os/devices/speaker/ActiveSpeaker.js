export class ActiveSpeaker {

	static get active() {
		return localStorage.getItem("selectedSpeaker") ?? null
	}

	static set active(speaker) {
		if (speaker == null) {
			localStorage.removeItem("selectedSpeaker")
		}
		else {
			localStorage.setItem("selectedSpeaker", speaker)
		}
	}

	static async setSpeakerForAudio(audioElement, deviceId = ActiveSpeaker.active) {
		if (!audioElement) {
			return false
		}

		// Fallback sequence: try the requested ID -> try current active -> try browser default string -> fail
		const targetDeviceId = deviceId || ActiveSpeaker.active || "default"

		try {
			await audioElement.setSinkId(targetDeviceId)
			return true
		}
		catch (e) {
			console.warn(`[SpeakerApi] setSinkId failed for device [${targetDeviceId}], trying "default" fallback...`, e)

			// If the custom device ID failed and we haven't already tried "default", try the ultimate browser fallback
			if (targetDeviceId !== "default") {
				try {
					await audioElement.setSinkId("default")
					return true
				}
				catch (fallbackError) {
					console.error("[SpeakerApi] Ultimate \"default\" speaker fallback failed:", fallbackError)
				}
			}
		}

		return false
	}

	static async createAudio(url, deviceId = ActiveSpeaker.active) {
		const audio = new Audio(url)
		await this.setSpeakerForAudio(audio, deviceId)
		return audio
	}
}