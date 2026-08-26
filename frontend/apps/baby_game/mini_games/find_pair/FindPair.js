export class FindPair {

	constructor() {
		let cardsClicked = []

		const html = Dom.add(Html.findPair())

		for (const name of ["reindeer", "lavvu", "gakti"]) {
			const card = H.create("flip-card", {
				slots: {
					front: "?",
					back: name,
				},
				data: {
					name: name,
				},
			})

			const clonedCard = card.clone()

			card.onClick(() => {
				card.data.clicked = true
				console.log("clicked")
				cardsClicked.add(card)
				console.log(cardsClicked)
				if (cardsClicked.containsAll(card, clonedCard)) {
					console.log("match")

				}
			})

			html.cards.add(card)


			html.cards.add(clonedCard)

			clonedCard.onClick(() => {
				clonedCard.data.clicked = true
				console.log("clicked")
				cardsClicked.add(card)
			})
		}
	}

	update() {

	}

}
