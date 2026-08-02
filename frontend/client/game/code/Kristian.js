function confetti(x, y, count = 80) {
	for (let i = 0; i < count; i++) {
		const piece = document.createElement("div")

		piece.style.position = "fixed"
		piece.style.left = `${x}px`
		piece.style.top = `${y}px`
		piece.style.width = `${Math.random() * 7 + 4}px`
		piece.style.height = `${Math.random() * 4 + 4}px`
		piece.style.background = `hsl(${Math.random() * 360}, 90%, 60%)`
		piece.style.pointerEvents = "none"

		document.body.append(piece)

		const angle = Math.random() * Math.PI * 2
		const speed = Math.random() * 300 + 150
		const vx = Math.cos(angle) * speed
		const vy = Math.sin(angle) * speed
		const rotation = Math.random() * 720 - 360

		piece.animate(
			[
				{
					transform: "translate(0, 0) rotate(0deg)",
					opacity: 1
				},
				{
					transform: `translate(${vx}px, ${vy - 500}px) rotate(${rotation}deg)`,
					opacity: 0
				}
			],
			{
				duration: Math.random() * 800 + 700,
				easing: "cubic-bezier(.15,.8,.3,1)"
			}
		).finished.then(() => piece.remove())
	}
}

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
						// x.bounce()
						x.play("moveOut")
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
