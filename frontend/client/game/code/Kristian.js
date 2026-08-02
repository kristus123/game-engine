export class Kristian {

	constructor() {
		const html = Html.matte()
		Dom.add(html)


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
			ConfettiSplash(e)
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
				html.h1.textContent = "BRA jobbet"
				html.progress.style.width = html.progress.style.width.replace("%", "") + 1 + "%"

				html.list.forEach((x, i) => {
					setTimeout(() => {
						Confetti(x)
						Confetti(html.progress)
						x.play("bounce", { variables: { delay: 100 } })
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
