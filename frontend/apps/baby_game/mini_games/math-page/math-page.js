function newChallenge(html) {
	html.list.removeChildren()

	const challenge = [SamiCards.one, SamiCards.two, SamiCards.three]
	const queue = Queue()

	for const number of challenge.shuffle() {
		const card = `
			<div data-number="${number.text.number}" draggable class="math-number-card bgWhite">
				<p center class="textWhite">${number.text.norwegian}</p>
			</div>
		`.toHtml()

		card.onMouseDown(() => {
			Mix.master.play(number.audio.norwegian)
		})

		card.invisible()
		html.list.add(card)

		queue.addAndStart(next => {
			card.visible()
			card.play("moveIn", { onEnd: next })
		})
	}
}

export default {
	page: {
		persistOnClose: false,
		layout: "mini-game-layout",
	},
	onFirstDomAdd: ({ html }) => {
		html.list.sortableChildMoved = () => {
			if html.list.map(card => To.integer(card.data.number)).isAscending() {

				const queue = Queue().onEnd(() => {
					newChallenge(html)
				})

				for const card of html.list.children {
					queue.add(next => card.play("moveOut", {
						onHalf: next,
						onEnd: () => card.invisible(),
					}))
				}

				queue.start()

				Mix.master.play(Ableton.projects.voices.norwegian.veryGood)
			}
		}

		newChallenge(html)
	},
}
