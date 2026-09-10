export default ({ html, setState }) => {

	const alreadyPracticed = []

	let card = null
	function loadCard() {
		CardDb.random(c => {
			if (c) {
				card = c
				setState("hasCard")
			}
			else {
				card = null
				setState("noMoreCards")
			}
		})
	}
	loadCard()

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
				loadCard()
				alreadyPracticed.add(card)
			},
			hard: () => {
				CardDb.markHard(card)
				loadCard()
			},
		},
	}
}
