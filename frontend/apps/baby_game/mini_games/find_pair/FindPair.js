export class FindPair {

	constructor() {
		const html = Dom.add(Html.findPair())

		let wait = false

		for (const name of ["reindeer", "lavvu", "gakti", "wow"]) {
			Iterate(2, () => {
				const card = H.create("flip-card", {
					slots: {
						front: "?",
						back: name,
						iamge: "https://i.pinimg.com/1200x/96/f4/34/96f43454d8ab2a17cbe9341217556d76.jpg",
					},
					data: {
						name: name,
						found: "false",
					},
				})

				card.onClick(() => {
					if (wait) {
						return
					}

					card.data.clicked = "true"

					const cardsClicked = html.cards
						.filter(c => c.data.found == "false")
						.filter(c => c.data.clicked == "true")

					console.log(cardsClicked.length)

					if (cardsClicked.length == 2) {
						if (cardsClicked.every(c => c.data.name == name)) {
							console.log("you find it")
							cardsClicked.forEach(c => {
								c.removeOnClick()
								c.data.found = "true"
							})
						}
						else {

						}

						wait = true
						setTimeout(() => {
							html.cards
								.filter(c => c.data.found == "false")
								.forEach(c => c.data.clicked = "false")

							wait = false
						}, 500)
					}

				})


				html.cards.add(card)

			})
		}

		html.cards.randomizeOrder()

	}

	update() {

	}

}
