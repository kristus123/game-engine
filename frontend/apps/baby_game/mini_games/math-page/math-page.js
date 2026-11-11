function newChallenge(html) {
	if !html.fields.active {
		return
	}

	html.list.removeAttribute("sortable")
	html.list.removeChildren()

	const challenge = ["1", "2", "3"]
	const queue = Queue()

	for const number of challenge.shuffle() {
		const card = `
			<div data-number="${number}" draggable class="math-number-card bgWhite">
				<p center class="textWhite">${number}</p>
			</div>
		`.toHtml()

		card.onMouseDown(() => {
			Tts(number)
			switch number {
				case "1" {
					Mix.master.play(Ableton.projects.voices.nordSami.one)
				}
				case "2" {
					Mix.master.play(Ableton.projects.voices.nordSami.two)
				}
				case "3" {
					Mix.master.play(Ableton.projects.voices.nordSami.three)
				}
			}
			console.log("hei")
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
	onDomAdd: ({ html }) => {
		html.fields.active = true
		html.list.sortableChildMoved = () => {
			if !html.fields.active {
				return
			}

			const numbers = html.list.map(card => card.data.number)
			if !numbers.same(["1", "2", "3"]) {
				return
			}

			html.progress.data.value = To.integer(html.progress.data.value) + 50
			html.progress.style.width = html.progress.data.value + "%"
			html.list.removeAttribute("sortable")

			const queue = Queue()
			for const card of html.list.children {
				queue.add(next => card.play("moveOut", {
					onHalf: next,
					onEnd: () => card.invisible(),
				}))
			}

			queue.start({ onEnd: () => newChallenge(html) })
		}

		newChallenge(html)
	},
	onDomRemove: ({ html }) => {
		html.fields.active = false
		html.list.sortableChildMoved = null
	},
}
