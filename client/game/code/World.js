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
			const x = e.closest("[user-sortable]")
			console.log(x)
			x.orderBasedOnMousePosition(e)

			placeholder?.followMouse()
		}
	}

	update() {

	}

}
