const db = Db("jap")

const html = Html.addCard()

html.navigateToPracticeCard.onClick(() => {
	Page.go(PracticePage)
})

html.settings.onClick(() => {
	Page.go(SettingsPage)
})

const sound = {}

function _init() {
	for (const direction of ["Front", "Back"]) {
		const start = html.getId("startRecording" + direction)
		const stop = html.getId("stopRecording" + direction)
		const play = html.getId("play" + direction)

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

				if (html.playFront.enabled && html.playBack.enabled) {
					html.save.enable()
				}
			})
		})
	}
}

_init()

html.save.onClick(() => {
	db.save({
		front: sound["Front"],
		back: sound["Back"],
		score: 0,
		nextPracticeDate: LocalDate.now().toString(),
	}, () => {
		_init()
		html.save.disable()
	})
})

export const AddCardPage = Page.init(html)
