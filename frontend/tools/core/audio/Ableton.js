export class Ableton {
	static voices = {}
	static missingTracks = []

	static init() {
		this.voices = {}
		const project = AssetPaths.ableton.voices
		this.missingTracks = project.missingTracks ?? []

		for (const [trackName, trackInfo] of Object.entries(project.tracks)) {
			const audioBuffer = Mp3[trackInfo.audioPath]
			if (!audioBuffer) {
				throw new Error(`Ableton audio has not been loaded: ${trackInfo.audioPath}`)
			}

			const sheet = AudioSheet(audioBuffer, project.bpm)
			const track = {}
			const locators = trackInfo.locators

			for (let i = 0; i < locators.length; i++) {
				const locator = locators[i]
				const nextLocator = locators[i + 1]
				const endBeat = nextLocator
					? nextLocator.time
					: audioBuffer.duration * project.bpm / 60
				const durationInBeats = endBeat - locator.time
				if durationInBeats <= 0 {
					continue
				}

				const cue = sheet.createCue(locator.time, durationInBeats)
				cue.name = locator.name
				track[locator.name] = cue
			}

			this.voices[trackName] = track
		}

		return this.voices
	}
}
