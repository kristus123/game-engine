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
		console.log(SamiCards.hello)
		for const name of ["one", "two", "three"] {
			Iterate(2, () => {
				const card = H.create("flip-card", {
					slots: {
						front: "?",
						back: name,
						image: "https://i.pinimg.com/1200x/96/f4/34/96f43454d8ab2a17cbe9341217556d76.jpg",
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
					const audio = Mix.master.play(Ableton.projects.voices.norwegian[name])

					const cardsClicked = html.cards
						.filter(c => c.data.found == "false")
						.filter(c => c.data.clicked == "true")

					if cardsClicked.length == 1 {
						html.fields.cardAudio = audio
						return
					}

					if cardsClicked.length == 2 {
						html.fields.wait = true
						await Promise.all([html.fields.cardAudio, audio])

						if cardsClicked.every(c => c.data.name == name) {
							await Mix.master.play(Ableton.projects.voices.norwegian.veryGood)
							cardsClicked.forEach(c => {
								c.removeOnClick()
								c.data.found = "true"
								c.data.clicked = "true"
							})
						}

						await AsyncSleep(500)

						html.cards
							.filter(c => c.data.found == "false")
							.forEach(c => c.data.clicked = "false")
						html.fields.cardAudio = null
						html.fields.wait = false
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
