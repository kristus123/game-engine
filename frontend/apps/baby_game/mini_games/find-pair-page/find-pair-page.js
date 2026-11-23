export default {
	page: {
		persistOnClose: false,
		layout: "mini-game-layout",
	},
	onDomAdd: async ({ html }) => {
		for const info of [SamiCards.reindeer, SamiCards.mouse] {
			Iterate(2, () => {
				html.cards.add(H.create("flip-card", {
					slots: {
						front: "?",
						back: info.name,
						src: info.src,
					},
					data: {
						name: info.name,
						clicked: "false",
						found: "false",
					},
					onClick: async (e) => {
						if e.data.clicked == "true" || e.data.found == "true" {
							return // do nothing
						}
						else {
							e.data.clicked = "true"
						}

						await Mix.master.play(info.audio.norwegian)

						const allClicked = html.cards.filter(c => c.data.clicked == "true")

						if allClicked.length >= 2 {
							if allClicked.every(c => c.data.name == e.data.name) {
								allClicked.forEach(c => c.data.found = "true")
								await Mix.master.play(SamiCards.blue.audio.norwegian)
							}

							allClicked.forEach(c => c.data.clicked = "false")
						}

						if html.cards.every(c => c.data.found == "true") {
							await Mix.master.play(SamiCards.veryGood.audio.norwegian)
							await html.play("moveOut")
							Page.open("find-pair-page")
						}

					}
				}))
			})
		}

		// await html.play("pageEnterRight")
		html.cards.randomizeOrder()
	},
}
