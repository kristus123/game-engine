export class Ableton {

	static _init() {

		this.projects = {}

		for const info of AssetPaths.ableton {

			this.projects[info.name] = {
				_locators: info.locators.map(locator => locator.name).makeAllUnique().assertAllUnique(),
			}

			for const track of info.tracks {

				this.projects[info.name][track.name] = {}

				const sheet = AudioSheet(Mp3[track.audioPath], info.bpm)
				const audioDurationInBeats = Mp3[track.audioPath].duration * info.bpm / 60

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
						this.projects[info.name][track.name][locator.name] ??= []
						this.projects[info.name][track.name][locator.name].push(cue)
					}
					else {
						this.projects[info.name][track.name][locator.name] = cue
					}
				}
			}

		}
	}

}
