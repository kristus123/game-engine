export default ({ html, setState }) => {

	const alreadyPracticed = []

	let card = null
	function loadNewCard() {
		setState("loading")

		CardDb.all(allCards => {
			const cardsToPractice = allCards.removeMany(alreadyPracticed)
			if (cardsToPractice) {
				card = cardsToPractice.random()
				Sound.playBlob(card.front)

				setState("hasCard")
			}
			else {
				setState("noMoreCards")
			}
		})
	}
	loadNewCard()

	return {
		state: "loading",
		methods: {
			playFront: () => {
				Sound.playBlob(card.front)
			},
			playBack: () => {
				Sound.playBlob(card.back)
			},
			easy: () => {
				CardDb.markEasy(card)
				loadNewCard()
				alreadyPracticed.add(card)
			},
			hard: () => {
				CardDb.markHard(card)
				loadNewCard()
			},
		},
	}
}
