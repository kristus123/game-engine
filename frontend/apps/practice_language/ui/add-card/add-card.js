export default async ({ html, setState }) => {

	const cardDb = await CardDb()

	let direction = null

	let frontSound = null
	let backSound = null

	Mic.deviceId = "default"
	console.log(await Mic.all())

	return {
		methods: {
			save: () => {
				console.log("caling save")
				cardDb.save({ frontSound, backSound }, () => {
					html.playFront.disable()
					html.playBack.disable()
					html.save.disable()

					frontSound = null
					backSound = null
				})
			},
			recordFront: () => {
				direction = "front"
				Mic.startRecording(() => {
				})
			},
			playFront: () => {
				console.log("playing front")
				Sound.playBlob(frontSound)
			},
			recordBack: () => {
				direction = "back"
				Mic.startRecording(() => {
				})
			},
			playBack: () => {
				console.log("playing back")
				Sound.playBlob(backSound)
			},
			stopRecording: () => {
				Mic.stopRecording(blob => {
					if (direction == "front") {
						frontSound = blob
						html.playFront.enable()
					}
					else if (direction == "back") {
						backSound = blob
						html.playBack.enable()
					}
					else {
						throw new Error("x")
					}

					Sound.playBlob(blob)

					direction = null
					if (frontSound && backSound) {
						html.save.enable()
					}
				})
			},
		},
	}
}
