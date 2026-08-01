export class Kristian {

	constructor() {
		const html = Html.matte()
		this.html = html

		Dom.add(html)

		let placeholder = null

		DomMouse.onDrag = (e) => {
			placeholder = e.cloneNode(true)
			placeholder?.followMouse()
			Dom.floating(placeholder)

			e.invisible()
		}

		DomMouse.onDrop = (e) => {
			Dom.remove(placeholder)
			placeholder = null

			e.visible()

			html.h1.textContent = "BRA"
		}

		DomMouse.onMouseMove = (e) => {
		}

		DomMouse.whileDragging = (e) => {
			placeholder?.followMouse()

			for (const h of DomMouse.hovering) { // find better solution for this
				const list = h.closest("[sortable]")
				if (list) {
					list.orderBasedOnMousePosition(e)
					break
				}
			}
		}
	}

	update() {
	}

}
