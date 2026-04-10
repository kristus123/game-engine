const db = Db("jap")

const a = F.addCard

a.x.onClick(() => {
	Page.go(PracticePage)
})

const sound = {}

function _init(direction) {
	const start = a.getId("startRecording" + direction)
	const stop = a.getId("stopRecording" + direction)
	const play = a.getId("play" + direction)

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

			if (a.playFront.enabled && a.playBack.enabled) {
				a.save.enable()
			}

		})
	})
}

_init("Front")
_init("Back")

a.save.onClick(() => {
	db.save({
		front: sound["Front"],
		back: sound["Back"],
		score: 0,
		nextPracticeDate: LocalDate.now().toString(),
	}, (x) => {
		console.log(x)
		_init("Front")
		_init("Back")
		a.save.disable()
	})
})

export const AddCardPage = Page.init(a)
