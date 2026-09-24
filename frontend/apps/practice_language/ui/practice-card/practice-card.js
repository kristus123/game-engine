export default async ({ html, setState }) => {

	Screen.keepAwake()

	let card = null
	const cardsPracticed = []

	const cardDb = await CardDb()
	const stopWatch = StopWatch().start()
	setInterval(() => {
		html.time.content = stopWatch.mmss
	}, 950)

	async function loadNewCard() {
		console.log("striggerding")
		setState("loading")

		const cardsToPractice = (await cardDb.all())
			.filter(c => cardsPracticed.missing(c._dbKey))
			.filter(c => LocalDate(c.nextPracticeDate).isDue())

		if (cardsToPractice) {
			card = cardsToPractice.random()
			Sound.playBlob(card.front)
			console.log("swag")

			return setState("hasCard")
		}
		else {
			return setState("noMoreCards")
		}
	}

	const r = {
		state: async () => {
			return loadNewCard() // kinda hacky but ok for now
		},
		methods: {
			playFront: async () => {
				Sound.playBlob(card.front)
			},
			playBack: async () => {
				Sound.playBlob(card.back)
			},
			easy: async () => {
				card.score += 1

				card.nextPracticeDate = LocalDate.now()
					.plusDays(card.score)
					.toString()

				await cardDb.update(card)

				if (card.score > 0) {
					cardsPracticed.add(card._dbKey)
				}

				await loadNewCard()
			},
			hard: async () => {
				card.score -= 1
				card.nextPracticeDate = LocalDate.now().toString()
				await cardDb.update(card)

				await loadNewCard()
			},
			practiceMore: async () => {

				cardsPracticed.clear()

				for (const c of await cardDb.all()) {
					c.nextPracticeDate = LocalDate.now().toString()
					await cardDb.update(c)
				}

				await loadNewCard()
			},
			deleteCard: async () => {
				console.log("deleitng")
				cardDb.delete(card)

				await loadNewCard()
			},
		},
	}

	Con.left = () => {
		console.log("clicked left")
		r.methods.easy()
	}

	Con.right = () => {
		console.log("clicked right")
		r.methods.hard()
	}

	Con.triangle = () => {
		console.log("clicked left")
		r.methods.playFront()
	}

	Con.cross = () => {
		console.log("clicked right")
		r.methods.playBack()
	}

	FrameLoop(() => {
		Con.update()
	})

	return r
}
