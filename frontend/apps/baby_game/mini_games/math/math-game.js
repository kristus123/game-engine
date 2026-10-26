async function setup(html) {
	let active = false
	let placeholder = null
	const dragHandlers = {}

	function newChallenge() {
		if !active {
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
				card.play("moveIn", {
					onEnd: next,
				})
			})
		}

		queue.start({
			onEnd: () => {
				if active {
					html.test.placeOver(html.list.children.last)
				}
			}
		})

		dragHandlers.onDrag = e => {
			if !html.list.contains(e) {
				return
			}
			placeholder = e.cloneNode(true)
			Dom.floating(placeholder)
			placeholder.followMouse(0, -50)

			e.invisible()
		}

		dragHandlers.onDrop = e => {
			if !placeholder {
				return
			}

			placeholder.remove()
			placeholder = null

			e.visible()

			const c = html.list.map(c => c.data.number)
			if c.same(challenge) {
				html.progress.data.value = To.integer(html.progress.data.value) + 50
				html.progress.style.width = html.progress.data.value + "%"

				const queue = Queue()

				for const card of html.list.children {
					queue.add(next => card.play("moveOut", {
						onHalf: () => {
							next()
						},
						onEnd: () => {
							card.invisible()
						},
					}))
				}

				queue.start({
					onEnd: () => {
						newChallenge()
					},
				})
			}
		}

		dragHandlers.whileDragging = e => {
			if !placeholder {
				return
			}

			placeholder.followMouse(0, -50)

			for const h of DomMouse.hovering { // find better solution for this
				const list = h.closest("[sortable]")
				if list == html.list {
					list.orderBasedOnMousePosition(e, () => {
						console.log("onchange baby")
						html.test.placeOver(html.list.children.last)
					})

					break
				}
			}
		}

		Object.assign(DomMouse, dragHandlers)
	}

	return {
		onDomAdd: () => {
			active = true
			newChallenge()
		},
		onDomRemove: () => {
			active = false
			placeholder?.remove()
			placeholder = null

			for const [name, handler] of Object.entries(dragHandlers) {
				if DomMouse[name] == handler {
					DomMouse[name] = () => {}
				}
			}
		},
	}
}

export default {
	fields: () => ({ options: null }),
	onFirstDomAdd: async (html) => {
		html.fields.options = await setup(html)
	},
	onDomAdd: (html) => html.fields.options.onDomAdd(),
	onDomRemove: (html) => html.fields.options.onDomRemove(),
}
