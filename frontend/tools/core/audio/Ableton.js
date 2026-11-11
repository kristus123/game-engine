export class Ableton {
	static projects = {}

	static init() {
		const projects = {}
		const allLocators = []
		AssetPaths.ableton.forEach((projectName, projectInfo) => {
			const project = {}
			projectInfo.locators.forEach(locator => {
				allLocators.push({ projectName, ...locator })
			})
			projectInfo.tracks.forEach((trackName, trackInfo) => {
				const audioBuffer = Mp3[trackInfo.audioPath]
				if !audioBuffer {
					throw new Error(`Ableton audio has not been loaded: ${trackInfo.audioPath}`)
				}

				const sheet = AudioSheet(audioBuffer, projectInfo.bpm)
				const track = {}
				const locators = projectInfo.locators
				for let i = 0; i < locators.length; i++ {
					const locator = locators[i]
					const nextLocator = locators[i + 1]
					const durationInBeats = nextLocator
						? nextLocator.time - locator.time
						: (audioBuffer.duration * projectInfo.bpm / 60) - locator.time
					if durationInBeats <= 0 {
						continue
					}
					const cue = sheet.createCue(locator.time, durationInBeats)
					cue.name = locator.name
					track[locator.name] = cue
				}
				project[trackName] = track
			})
			projects[projectName] = project
		})
		projects._allLocators = allLocators
		this.projects = projects
		return this.projects
	}
}
