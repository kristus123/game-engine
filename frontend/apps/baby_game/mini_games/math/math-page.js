function newChallenge(html) {
	const fields = html.fields
	if !fields.active {
		return
	}

	html.list.removeChildren()
	html.h1.textContent = "try again"

	const challenge = ["1", "2"]
	const queue = Queue()

	for const number of challenge.shuffle() {
		const card = `
			<div data-number="${number}" draggable style="min-width: 100px; min-height: 100px" class="bgWhite">
				<p style="font-size:85px" center class="textWhite">${number}</p>
			</div>
	`.toHtml()

		card.invisible()
		html.list.add(card)

		queue.add(next => {
			card.visible()
			card.play("moveIn", { onEnd: next })
		})
	}

	queue.start({
		onEnd: () => {
			if fields.active {
				html.test.placeOver(html.list.children.last)
			}
		},
	})
}

function createDragHandlers(html) {
	const fields = html.fields
	const handlers = {}

	handlers.onDrag = e => {
		if !html.list.contains(e) {
			return
		}

		fields.placeholder = e.cloneNode(true)
		Dom.floating(fields.placeholder)
		fields.placeholder.followMouse(0, -50)
		e.invisible()
	}

	handlers.onDrop = e => {
		if !fields.placeholder {
			return
		}

		fields.placeholder.remove()
		fields.placeholder = null
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
	}

	handlers.whileDragging = e => {
		if !fields.placeholder {
			return
		}

		fields.placeholder.followMouse(0, -50)
		for const hovered of DomMouse.hovering {
			const list = hovered.closest("[sortable]")
			if list == html.list {
				list.orderBasedOnMousePosition(e, () => html.test.placeOver(html.list.children.last))
				break
			}
		}
	}

	return handlers
}

export default {
	page: {
		persistOnClose: false,
	},
	fields: () => ({
		active: false,
		placeholder: null,
		dragHandlers: null,
	}),
	onDomAdd: ({ html }) => {
		const fields = html.fields
		fields.active = true
		fields.dragHandlers = createDragHandlers(html)
		Object.assign(DomMouse, fields.dragHandlers)
		newChallenge(html)
	},
	onDomRemove: ({ html }) => {
		const fields = html.fields
		fields.active = false
		fields.placeholder?.remove()
		fields.placeholder = null

		for const [name, handler] of Object.entries(fields.dragHandlers) {
			if DomMouse[name] == handler {
				DomMouse[name] = () => {}
			}
		}
	},
}
