function arraysEqual(a, b) {
	return (
    	a.length == b.length &&
    	a.every((value, index) => value == b[index])
	)
}

export class Kristian {

	constructor() {
		const html = Html.matte()
		for (const x of [4, 3, 2, 1]) {
			html.list.add(`
				<div data-value="${x}" draggable style="width: 100px; height: 100px" class="bgWhite">
					<p style="font-size:65px" center class="textWhite">${x}</p>
				</div>
			`.toHtml())
		}

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


			const c = (html.list.map(c => c.getAttribute("data-value")))
			if (arraysEqual(c, ["1", "2", "3", "4"])) {
				html.h1.textContent = "BRA"
			}
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
