export default {
	page: {
		persistOnClose: false,
		layout: "mini-game-layout",
	},
	fields: () => ({
		wait: false,
		cardAudio: null,
	}),
	onFirstDomAdd: ({ html }) => {
		for const name of ["one", "two", "three"] {
			const info = SamiCards[name]
			Iterate(2, () => {
				const card = H.create("flip-card", {
					slots: {
						front: "?",
						back: name,
						src: info.src,
					},
					data: {
						name: name,
						found: "false",
					},
				})

				card.onClick(async () => {
					if html.fields.wait || card.data.clicked == "true" {
						return
					}

					card.data.clicked = "true"
					const playback = Mix.master.play(info.audio.norwegian)

					const cardsClicked = html.cards
						.filter(c => c.data.found == "false")
						.filter(c => c.data.clicked == "true")

					if cardsClicked.length == 1 {
						html.fields.cardAudio = playback
						return
					}

					if cardsClicked.length == 2 {
						html.fields.wait = true
						await Promise.all([html.fields.cardAudio, playback])

						if cardsClicked.every(c => c.data.name == name) {
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
						html.fields.cardAudio = null
						html.fields.wait = false

						await AsyncSleep(500)
					}

					if html.cards.every(c => c.data.found == "true") {
						console.log("all found!")
						const q = Queue()

						html.cards.forEach(c => {
							q.add(next => c.play("fadeOut", {
								onHalf: () => {
									next()
								},
								onEnd: () => {
									c.invisible()
								},
							}))
						})

						q.start({
							onEnd: () => {
								console.log("finished")
							},
						})
					}
				})

				html.cards.add(card)
			})
		}

		html.cards.randomizeOrder()
	},
	onDomRemove: ({ html }) => {
		html.fields.wait = false
		html.fields.cardAudio = null
	},
}
