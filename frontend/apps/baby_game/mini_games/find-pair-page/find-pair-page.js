export default {
	page: {
		persistOnClose: false,
		layout: "mini-game-layout",
	},
	onDomAdd: async ({ html }) => {
		for const info of [SamiCards.one, SamiCards.two, SamiCards.three] {
			Iterate(2, () => {
				const card = H.create("flip-card", {
					slots: {
						front: "?",
						back: info.name,
						src: info.src,
					},
					data: {
						name: info.name,
						found: "false",
					},
					onClick: async (e) => {
						if e.data.clicked == "true" {
							return
						}

						e.data.clicked = "true"
						await Mix.master.play(info.audio.sorSami)

						const cardsClicked = html.cards
							.filter(c => c.data.found == "false")
							.filter(c => c.data.clicked == "true")

						if cardsClicked.length == 1 {
							// do nothing
						}
						else if cardsClicked.length == 2 {

							if cardsClicked.every(c => c.data.name == info.name) {
								cardsClicked.forEach(c => {
									c.removeOnClick()
									c.data.found = "true"
									c.data.clicked = "true"
								})
								await Mix.master.play(SamiCards.veryGood.audio.norwegian)
							}

							html.cards
								.filter(c => c.data.found == "false")
								.forEach(c => c.data.clicked = "false")

							await AsyncSleep(500)
						}

						if html.cards.every(c => c.data.found == "true") {
							console.log("all found!")
						}
					}
				})

				html.cards.add(card)
			})
		}

		// await html.play("pageEnterRight")
		html.cards.randomizeOrder()
	},
}
