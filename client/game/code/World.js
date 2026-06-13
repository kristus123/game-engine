export class World {

	constructor() {
		const t = Html.test()
		Dom.add(t)
		let placeholder = H.p("x")

		Dom.onDrag = (e) => {
			placeholder = e.cloneNode(true).css("font-size: 50px")
			Dom.floating(placeholder)
			e.invisible()
		}
		Dom.onDrop = (e) => {
			Dom.remove(placeholder)
			e.visible()
		}
		Dom.onMouseMove = (e) => {
			console.log(e.target.closest("[user-sortable]"))
		}
		Dom.whileDragging = (e) => {
			t.firstList.order(e)
			placeholder.swag(Mouse.screen)
		}
	}

	update() {

	}

}
