const db = Db("jap")

const html = F.addCard

html.navigateToPracticeCard.onClick(() => {
	Page.go(PracticePage)
})

const sound = {}

function _init(direction) {
	const start = html.getId("startRecording" + direction)
	const stop = html.getId("stopRecording" + direction)
	const play = html.getId("play" + direction)

	start.enable()
	stop.disable()
	play.disable()

	start.onClick(() => {
		Microphone.start()
		start.disable()
		stop.enable()
	})

	stop.onClick(() => {

		Microphone.stop(blob => {
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

_init("Front")
_init("Back")

html.save.onClick(() => {
	db.save({
		front: sound["Front"],
		back: sound["Back"],
		score: 0,
		nextPracticeDate: LocalDate.now().toString(),
	}, () => {
		_init("Front")
		_init("Back")
		html.save.disable()
	})
})

export const AddCardPage = Page.init(html)
