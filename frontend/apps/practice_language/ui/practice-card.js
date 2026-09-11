export default async ({ html, setState }) => {

	let card = null
	const alreadyPracticed = []

	const cardDb = await CardDb()

	async function loadNewCard() {
		console.log("striggerding")
		setState("loading")

		const cardsToPractice = (await cardDb.all())
			.filter(c => !alreadyPracticed.contains(c._dbKey))

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

	return {
		state: () => {
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
				card.nextPracticeDate = LocalDate.now().plusDays(1).toString()
				await cardDb.update(card)
				console.log("updated card")

				alreadyPracticed.add(card._dbKey)
				await loadNewCard()
			},
			hard: async () => {
				card.score -= 1
				card.nextPracticeDate = LocalDate.now().toString()
				await cardDb.update(card)

				await loadNewCard()
			},
		},
	}
}
