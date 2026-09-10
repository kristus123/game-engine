export default ({ html }) => {
	const db = Db("jap")

	let direction = null
	let frontSound = null
	let backSound = null

	return {
		methods: {
			save: () => {
				db.save({
					front: frontSound,
					back: backSound,
					score: 0,
					nextPracticeDate: LocalDate.now().toString(),
				}, () => {
					html.playFront.disable()
					html.playBack.disable()
					html.save.disable()
				})
			},
			recordFront: () => {
				direction = "front"
				Mic.start(() => {
				})
			},
			playFront: () => {
				console.log("playing front")
			},
			recordBack: () => {
				direction = "back"
				Mic.start(() => {
				})
			},
			playBack: () => {
				console.log("playing back")
			},
			stopRecording: () => {
				Mic.stop(blob => {
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

					// Sound.playBlob(blob)
					direction = null
					if (frontSound && backSound) {
						html.save.enable()
					}
				})
			},
		},
	}
}
