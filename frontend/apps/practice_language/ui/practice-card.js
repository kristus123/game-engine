export default async ({ html, setState }) => {

	const alreadyPracticed = []

	const cardDb = await CardDb()

	let card = null
	async function loadNewCard() {
		setState("loading")

		const cardsToPractice = (await cardDb.all()).removeMany(alreadyPracticed)

		if (cardsToPractice) {
			card = cardsToPractice.random()
			Sound.playBlob(card.front)

			setState("hasCard")
		}
		else {
			setState("noMoreCards")
		}
	}
	await loadNewCard()

	return {
		state: "loading",
		methods: {
			async playFront: () => {
				Sound.playBlob(card.front)
			},
			async playBack: () => {
				Sound.playBlob(card.back)
			},
			async easy: () => {
				card.score += 1
				card.nextPracticeDate = LocalDate.now().plusDays(1).toString()
				await cardDb.update(card)

				alreadyPracticed.add(card)
				await loadNewCard()
			},
			async hard: () => {
				card.score -= 1
				card.nextPracticeDate = LocalDate.now().toString()
				await cardDb.update(card)

				await loadNewCard()
			},
		},
	}
}
