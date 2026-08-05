export class Kristian {

	constructor() {
		const html = Html.matte()
		Dom.add(html)

		this.objects = Objects([

		])

		function newChallenge() {
			html.list.removeChildren()
			html.h1.textContent = "try again"

			const challenge = ["1", "2"]

			for (const number of challenge.shuffle()) {
				html.list.add(`
					<div data-number="${number}" draggable style="min-width: 100px; min-height: 100px" class="bgWhite">
						<p style="font-size:85px" center class="textWhite">${number}</p>
					</div>
				`.toHtml())
			}

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

					if (html.progress.data.value >= 100) {
						html.progress.style.background = 'orange'

					}

					newChallenge()
				}
			}

			DomMouse.whileDragging = e => {
				placeholder.followMouse(0, -50)

				for (const h of DomMouse.hovering) { // find better solution for this
					const list = h.closest("[sortable]")
					if (list) {
						list.orderBasedOnMousePosition(e)
						break
					}
				}
			}

		}

		newChallenge()
	}

	update() {
		this.objects.update()
	}

}
