export class Ableton {

	static _init() {

		this.projects = {}

		AssetPaths.ableton.forEach((name, info) => {

			this.projects[name] = {
				_locators: info.locators.map(locator => locator.name).makeAllUnique().assertAllUnique(),
			}

			info.tracks.forEach((trackName, trackInfo) => {

				this.projects[name][trackName] = {}

				const sheet = AudioSheet(Mp3[trackInfo.audioPath], info.bpm)
				const audioDurationInBeats = Mp3[trackInfo.audioPath].duration * info.bpm / 60

				for let i = 0; i < info.locators.length; i++ {
					const locator = info.locators[i]
					const end = info.locators[i + 1]?.time
					const cueEndBeat = Math.min(end ?? audioDurationInBeats, audioDurationInBeats)
					const durationInBeats = cueEndBeat - locator.time
					if durationInBeats <= 0 {
						continue
					}
					const cue = sheet.createCue(locator.time, durationInBeats)
					if locator.isArray {
						this.projects[name][trackName][locator.name] ??= []
						this.projects[name][trackName][locator.name].push(cue)
					}
					else {
						this.projects[name][trackName][locator.name] = cue
					}
				}
			})
		})
	}
}
