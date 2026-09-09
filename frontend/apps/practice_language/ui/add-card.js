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
					_init()
				})
			},
			recordFront: () => {
				direction = "front"
				Mic.start(() => {
				})
			},
			recordBack: () => {
				direction = "back"
			},
			stopRecording: () => {

				Mic.stop(blob => {
					if (direction == "front") {
						frontSound = blob
					}
					else if (direction == "back") {
						backSound = blob
					}

					// Sound.playBlob(blob)
					direction = null
				})
			},
		},
	}
}
