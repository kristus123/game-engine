const db = Db("jap")

const a = F.addCard

let frontSound = null
let backSound = null

console.log(a.ids)


function xxx(direction) {
	const start = a.getId("startRecording" + direction)
	const stop = a.getId("stopRecording" + direction)
	const play = a.getId("play" + direction)

	start.onClick(() => {
		start.hide()
		stop.show()
		Microphone.start()
	})

	a.getId(stop).onClick(() => {
		stop.hide()
		start.show()

		Microphone.stop(blob => {
			Sound.playBlob(blob)
			frontSound = blob
		})
	})

	play.onClick(() => {
		Sound.playBlob(frontSound)
	})
	play.show()
	
}

xxx("Front")
xxx("Back")

a.save.onClick(() => {
})

export const AddCardPage = Page.init(a)
