export class SpeakerApi {

	static async apply(audioElement, deviceId = Speaker.selected) {
		if (!audioElement || !deviceId) {
			return false
		}

		if (typeof audioElement.setSinkId == "function") {
			try {
				await audioElement.setSinkId(deviceId)
				return true
			}
			catch (e) {
				console.warn("speaker sink id failed", e)
			}
		}

		return false
	}

	static async createAudio(url, deviceId = Speaker.selected) {
		const audio = new Audio(url)
		await this.apply(audio, deviceId)
		return audio
	}

}
