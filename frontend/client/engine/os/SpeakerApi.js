export class SpeakerApi {

	static async apply(audioElement, deviceId = Speaker.active) {
		if (!audioElement) {
			return false
		}

		// Fallback sequence: try the requested ID -> try current active -> try browser default string -> fail
		const targetDeviceId = deviceId || Speaker.active || "default"

		if (typeof audioElement.setSinkId === "function") {
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
					} catch (fallbackError) {
						console.error('[SpeakerApi] Ultimate "default" speaker fallback failed:', fallbackError)
					}
				}
			}
		}

		return false
	}

	static async createAudio(url, deviceId = Speaker.active) {
		const audio = new Audio(url)
		await this.apply(audio, deviceId)
		return audio
	}

}