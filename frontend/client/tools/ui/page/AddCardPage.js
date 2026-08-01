const db = Db("jap")

const h = Html.addCard()

h.navigateToPracticeCard.onClick(() => {
	Page.go(PracticePage)
})

h.settings.onClick(() => {
	Page.go(SettingsPage)
})

const sound = {}

function _init() {
	for (const direction of ["Front", "Back"]) {
		const start = h.getId("startRecording" + direction)
		const stop = h.getId("stopRecording" + direction)
		const play = h.getId("play" + direction)

		start.enable()
		stop.disable()
		play.disable()

		start.onClick(() => {
			start.disable()
			Mic.start(() => {
				stop.enable()
			})
		})

		stop.onClick(() => {
			Mic.stop(blob => {
				Sound.playBlob(blob)
				sound[direction] = blob

				start.enable()
				stop.disable()

				play.enable()
				play.onClick(() => {
					Sound.playBlob(sound[direction])
				})

				if (h.playFront.enabled && h.playBack.enabled) {
					h.save.enable()
				}
			})
		})
	}
}

_init()

h.save.onClick(() => {
	db.save({
		front: sound["Front"],
		back: sound["Back"],
		score: 0,
		nextPracticeDate: LocalDate.now().toString(),
	}, () => {
		_init()
		h.save.disable()
	})
})

export const AddCardPage = Page.init(h)
