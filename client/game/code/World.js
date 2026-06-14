export class World {

	constructor() {
		const t = Html.test()

		Dom.add(t)

		let placeholder = null

		Dom.onDrag = (e) => {
			placeholder = e.cloneNode(true).css("font-size: 50px")
			Dom.floating(placeholder)

			e.invisible()
		}

		Dom.onDrop = (e) => {
			Dom.remove(placeholder)
			placeholder = null

			e.visible()
		}

		Dom.onMouseMove = (e) => {
		}

		Dom.whileDragging = (e) => {
			placeholder?.followMouse()

			const list = Dom.hovering?.closest("[user-sortable]")

			if (list) {
				const x = e.closest("[user-sortable]")
				list.orderBasedOnMousePosition(e)
			}
		}
	}

	update() {
		console.log(Dom.hovering)
		const list = Dom.hovering.closest("[user-sortable]")
	}

}
