export class Ableton {
	static projects = {}

	static init() {
		this.projects = {}
		AssetPaths.ableton.forEach((projectName, projectInfo) => {
			const project = {}
			projectInfo.tracks.forEach((trackName, trackInfo) => {
				const audioBuffer = Mp3[trackInfo.audioPath]
				if (!audioBuffer) {
					throw new Error(`Ableton audio has not been loaded: ${trackInfo.audioPath}`)
				}

				const sheet = AudioSheet(audioBuffer, projectInfo.bpm)
				const track = {}
				const locators = trackInfo.locators
				for (let i = 0; i < locators.length; i++) {
					const locator = locators[i]
					const nextLocator = locators[i + 1]
					const durationInBeats = nextLocator
						? nextLocator.time - locator.time
						: (audioBuffer.duration * projectInfo.bpm / 60) - locator.time
					if (durationInBeats <= 0) continue
					const cue = sheet.createCue(locator.time, durationInBeats)
					cue.name = locator.name
					track[locator.name] = cue
				}
				project[trackName] = track
			})
			this.projects[projectName] = project
		})
		return this.projects
	}
}
