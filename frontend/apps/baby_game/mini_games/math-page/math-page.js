function newChallenge(html) {
	if !html.fields.active {
		return
	}

	html.list.removeAttribute("sortable")
	html.list.removeChildren()

	
	const challenge = [SamiCards.one, SamiCards.two, SamiCards.three]
	const queue = Queue()

	for const number of challenge.shuffle()  {
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

		queue.add(next => {
			card.visible()
			card.play("moveIn", { onEnd: next })
		})
	}

	queue.start({
		onEnd: () => {
			if html.fields.active {
				html.list.setAttribute("sortable", "")
			}
		},
	})
}

export default {
	page: {
		persistOnClose: false,
		layout: "mini-game-layout",
	},
	fields: () => ({
		active: false,
	}),
	onFirstDomAdd: ({ html }) => {
		html.fields.active = true
		html.list.sortableChildMoved = () => {
			if !html.fields.active {
				return
			}

			if html.list.map(card => To.integer(card.data.number)).isAscending() {
				html.list.removeAttribute("sortable")

				const queue = Queue()
				for const card of html.list.children {
					queue.add(next => card.play("moveOut", {
						onHalf: next,
						onEnd: () => card.invisible(),
					}))
				}

				Mix.master.play(Ableton.projects.voices.norwegian.veryGood)
				queue.start({
					onEnd: () => {
						newChallenge(html)
					},
				})
			}
		}

		newChallenge(html)
	},
	onDomRemove: ({ html }) => {
		html.fields.active = false
		html.list.sortableChildMoved = null
	},
}
