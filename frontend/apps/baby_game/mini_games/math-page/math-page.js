function newChallenge(html) {

	html.list.removeChildren()

	const challenge = [
		SamiCards.one,
		SamiCards.two,
		SamiCards.three,
		// SamiCards.four,
		// SamiCards.five,
		// SamiCards.six,
		// SamiCards.seven,
		// SamiCards.eight,
		// SamiCards.nine,
		// SamiCards.ten,
	]

	const queue = Queue()

	for const samiCard of challenge.shuffle() {
		const card = `
			<div data-number="${samiCard.text.number}" draggable class="math-number-card bgWhite">
				<p center class="textWhite">${samiCard.text.norwegian}</p>
			</div>
		`.toHtml()

		card.samiCard = samiCard

		card.onMouseDown(() => {
			Mix.master.play(samiCard.audio.norwegian)
		})

		card.invisible()
		html.list.add(card)

		queue.addAndStart(next => {
			card.visible()
			card.play("moveIn", { onEnd: next })
			Mix.master.play(samiCard.audio.norwegian)
		})
	}
}

export default {
	page: {
		persistOnClose: false,
		layout: "mini-game-layout",
	},
	onFirstDomAdd: async ({ html }) => {
		html.list.sortableChildMoved = async () => {
			if html.list.map(card => To.integer(card.data.number)).isAscending() {

				await Promise.all([
					Promise.all(html.list.children.map(card => card.play("jump"))),
					Mix.master.play(Ableton.projects.voices.norwegian.veryGood),
				])

				const queue = Queue().onEnd(() => {
					newChallenge(html)
				})

				for const card of html.list.children {
					console.log(card.samiCard.audio)

					queue.addAndStart(async next => {
						await Promise.all([
							Mix.master.play(card.samiCard.audio.norwegian),
							card.play("jump"),
						])

						await card.play("moveOut", {
							onHalf: next,
							onEnd: () => card.invisible(),
						})
					})
				}

			}
		}

		newChallenge(html)
	},
}
