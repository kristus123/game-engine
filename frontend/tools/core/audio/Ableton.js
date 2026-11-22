export class Ableton {
	static projects = {}

	static _init() {

		const locators = []

		AssetPaths.ableton.forEach((projectName, projectInfo) => {
			const project = {}
			projectInfo.locators.forEach(locator => {
				locators.push({ projectName, ...locator })
			})
			projectInfo.tracks.forEach((trackName, trackInfo) => {
				const audioBuffer = Mp3[trackInfo.audioPath]
				if !audioBuffer {
					throw new Error(`Ableton audio has not been loaded: ${trackInfo.audioPath}`)
				}

				const sheet = AudioSheet(audioBuffer, projectInfo.bpm)
				const track = {}
				const locators = projectInfo.locators
				const audioDurationInBeats = audioBuffer.duration * projectInfo.bpm / 60
				for let i = 0; i < locators.length; i++ {
					const locator = locators[i]
					const nextLocator = locators[i + 1]
					const cueEndBeat = Math.min(nextLocator ? nextLocator.time : audioDurationInBeats, audioDurationInBeats)
					const durationInBeats = cueEndBeat - locator.time
					if durationInBeats <= 0 {
						continue
					}
					const cue = sheet.createCue(locator.time, durationInBeats)
					cue.name = locator.name
					if locator.isArray {
						if !track[locator.name] {
							track[locator.name] = []
						}
						track[locator.name].push(cue)
					}
					else {
						track[locator.name] = cue
					}
				}
				project[trackName] = track
			})
			this.projects[projectName] = project
		})

		this.projects._locators = locators
	}
}
