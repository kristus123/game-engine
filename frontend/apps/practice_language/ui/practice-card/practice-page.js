export const page = {
	persistOnClose: true,
}

export default async ({ html, setState }) => {

	Screen.keepAwake()

	const stopWatch = StopWatch().start()
	setInterval(() => {
		html.time.content = stopWatch.mmss
	}, 950)

	let card = null
	const cardDb = await CardDb()
	async function loadNewCard() {
		setState("loading")

		card = await cardDb.cardToPractice()

		if card {
			Sound.playBlob(card.practiceSide().sound)
			return setState("hasCard")
		}
		else {
			return setState("noMoreCards")
		}
	}

	const r = {
		state: async () => {
			return await loadNewCard() // kinda hacky but ok for now
		},
		methods: {
			playFront: async () => {
				Sound.playBlob(card.practiceSide().sound)
			},
			playBack: async () => {
				Sound.playBlob(card.otherSide().sound)
			},
			easy: async () => {
				await card.markEasy()
				await cardDb.update(card)
				await loadNewCard()
			},
			hard: async () => {
				await card.markHard()
				await cardDb.update(card)
				await loadNewCard()
			},
			practiceMore: async () => {
				await cardDb.resetAllDueDates()
				await loadNewCard()
			},
			deleteCard: async () => {
				await cardDb.delete(card)
				await loadNewCard()
			},
		},
	}

	GamepadController.left = () => {
		r.methods.easy()
	}

	GamepadController.right = () => {
		r.methods.hard()
	}

	GamepadController.triangle = () => {
		r.methods.playFront()
	}

	GamepadController.cross = () => {
		r.methods.playBack()
	}

	FrameLoop(() => {
		GamepadController.update()
	})

	return r
}
