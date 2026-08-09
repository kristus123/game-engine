export class Kristian {

	constructor() {
		const html = Html.matte()
		Dom.add(html)

		function newChallenge() {
			html.list.removeChildren()

			html.h1.textContent = "try again"

			const challenge = ["1", "2"]

			const queue = Queue()

			for (const number of challenge.shuffle()) {
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
					html.test.placeOver(html.list.children.last)
				}
			})

			let placeholder = null

			DomMouse.onDrag = e => {
				placeholder = e.cloneNode(true)
				Dom.floating(placeholder)
				placeholder.followMouse(0, -50)

				e.invisible()
			}

			DomMouse.onDrop = e => {
				Dom.remove(placeholder)
				placeholder = null

				e.visible()

				const c = html.list.map(c => c.data.number)
				if (c.same(challenge)) {
					html.progress.data.value = To.integer(html.progress.data.value) + 50
					html.progress.style.width = html.progress.data.value + "%"

					const queue = Queue()

					for (const card of html.list.children) {
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

			DomMouse.whileDragging = e => {
				placeholder.followMouse(0, -50)

				for (const h of DomMouse.hovering) { // find better solution for this
					const list = h.closest("[sortable]")
					if (list) {
						list.orderBasedOnMousePosition(e, () => {
							console.log("onchange baby")
							html.test.placeOver(html.list.children.last)
						})

						break
					}
				}
			}
		}

		newChallenge()
	}

	update() {
	}

}
