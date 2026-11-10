function newChallenge(html) {
	if !html.fields.active {
		return
	}

	html.list.removeChildren()
	html.h1.textContent = "try again"

	const challenge = ["1", "2"]
	const queue = Queue()

	for const number of challenge.shuffle() {
		const card = `
			<div data-number="${number}" draggable class="math-number-card bgWhite">
				<p center class="textWhite">${number}</p>
			</div>
		`.toHtml()

		card.invisible()
		html.list.add(card)

		queue.add(next => {
			card.visible()
			card.play("moveIn", { onEnd: next })
		})
	}

	queue.start()
}

export default {
	page: {
		persistOnClose: false,
	},
	fields: () => ({
		active: false,
		placeholder: null,
	}),
	onDomAdd: ({ html, onDomRemove }) => {
		html.fields.active = true

		newChallenge(html)

		const drag = html.list.onDragChild({
			onDrag: e => {
				html.fields.placeholder = e.cloneNode(true)
				Dom.floating(html.fields.placeholder)
				html.fields.placeholder.followMouse(0, -50)
				e.invisible()
			},
			onDrop: e => {
				if !html.fields.placeholder {
					return
				}

				html.fields.placeholder.remove()
				html.fields.placeholder = null
				e.visible()

				const numbers = html.list.map(card => card.data.number)
				if !numbers.same(["1", "2"]) {
					return
				}

				html.progress.data.value = To.integer(html.progress.data.value) + 50
				html.progress.style.width = html.progress.data.value + "%"

				const queue = Queue()
				for const card of html.list.children {
					queue.add(next => card.play("moveOut", {
						onHalf: next,
						onEnd: () => card.invisible(),
					}))
				}

				queue.start({ onEnd: () => newChallenge(html) })
			},
			whileDragging: () => {
				if !html.fields.placeholder {
					return
				}

				html.fields.placeholder.followMouse(0, -50)
			},
		})

		onDomRemove(() => {
			drag.removeListeners()
		})
	},
	onDomRemove: ({ html }) => {
		html.fields.active = false
		html.fields.placeholder?.remove()
		html.fields.placeholder = null
	},
}
