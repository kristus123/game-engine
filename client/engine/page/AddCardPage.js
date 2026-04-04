const db = Db("jap")

const a = F.addCard

let frontSound = null

a.startRecordingFront.onClick(() => {
	a.startRecordingFront.hide()

	a.stopRecordingFront.show()

	Microphone.start()
})

a.stopRecordingFront.onClick(() => {
	a.stopRecordingFront.hide()
	a.startRecordingFront.show()

	Microphone.stop(blob => {
		Sound.playBlob(blob)
		frontSound = blob
	})
})

a.playFront.onClick(() => {
	Sound.playBlob(frontSound)
})

export const AddCardPage = Page.init(a)
