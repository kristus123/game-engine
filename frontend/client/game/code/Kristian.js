export class Kristian {

	constructor() {
		const html = Html.matte()
		Dom.add(html)

		const challenge = ["1", "2", "tre", "4"]

		for (const number of challenge.shuffle()) {
			html.list.add(`
				<div bg-nature data-number="${number}" draggable style="min-width: 100px; min-height: 100px" class="bgWhite">
					<p style="font-size:85px" center class="textWhite">${number}</p>
				</div>
			`.toHtml())
		}

		setTimeout(() => {
			const copy = html.h1.copy()
			copy.invisible()
			html.main.prepend(copy)
			copy.shrink(800)
			html.h1.unshrink()
			html.h1.animateTowards(html.otherBox, 400)
		}, 200)

		let placeholder = null

		DomMouse.onDrag = e => {
			Tts(e.data.number)
			Mix.fx.play(Mp3.click)

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
				html.h1.textContent = "BRA"

				html.list.forEach((x, i) => {
					setTimeout(() => {
						x.bounce()
						Mix.fx.play(Mp3.click)
					}, 200 * i)
				})
			}
		}

		DomMouse.onMouseMove = e => {
		}

		DomMouse.whileDragging = e => {
			placeholder?.followMouse(0, -50)

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
