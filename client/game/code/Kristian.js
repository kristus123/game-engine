export class World {

	constructor() {
		const t = Html.test()

		Dom.add(t)

		let placeholder = null

		DomMouse.onDrag = (e) => {
			placeholder = e.cloneNode(true).css("font-size: 50px")
			Dom.floating(placeholder)

			e.invisible()
		}

		DomMouse.onDrop = (e) => {
			Dom.remove(placeholder)
			placeholder = null

			e.visible()
		}

		DomMouse.onMouseMove = (e) => {
		}

		DomMouse.whileDragging = (e) => {
			placeholder?.followMouse()

			for (const h of DomMouse.hovering) { // find better solution for this
				const list = h.closest("[user-sortable]")
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
