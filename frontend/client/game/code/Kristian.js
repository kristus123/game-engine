function shrink(element, duration = 1000) {
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    element.style.transition = `width ${duration}ms, height ${duration}ms`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    requestAnimationFrame(() => {
        element.style.width = "0px";
        element.style.height = "0px";
    });
}

function unshrink(element, duration = 1000) {

	const width = element.width
	const height = element.height

    element.style.transition = "none";
    element.style.width = "0px";
    element.style.height = "0px";

    requestAnimationFrame(() => {
        element.style.transition = `width ${duration}ms, height ${duration}ms`;
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
    });
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
		setTimeout(() => {
			const copy = html.h1.copy()
			copy.invisible()
			html.main.prepend(copy)
			shrink(copy, 1000)
			// unshrink(html.h1)
			html.h1.animateTowards(html.otherBox, 200)
		}, 500)

		let placeholder = null

		DomMouse.onDrag = (e) => {

			placeholder = e.cloneNode(true)
			Dom.floating(placeholder)
			placeholder.followMouse()

			e.invisible()
		}

		DomMouse.onDrop = (e) => {
			Dom.remove(placeholder)
			placeholder = null

			e.visible()

			const c = html.list.map(c => c.data.value)
			if (c.same(["1", "2", "3", "4"])) {
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
