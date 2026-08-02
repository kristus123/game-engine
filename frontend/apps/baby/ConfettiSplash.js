export function ConfettiSplash(element) {
	const rect = element.getBoundingClientRect()

	const count = 20
	for (let i = 0; i < count; i++) {
		const piece = document.createElement("div")

		const angle = Math.random() * Math.PI * 2

		const speed = Random.integerBetween(10, 400)

		piece.x = rect.left + rect.width / 2
		piece.y = rect.top + rect.height / 2

		piece.addCssVariable("vx", `${Math.cos(angle) * speed}px`)
		piece.addCssVariable("vy", `${Math.sin(angle) * speed}px`)
		piece.addCssVariable("color", "white")
		piece.addCssVariable("duration", "1s")

		Dom.add(piece)

		piece.play("confetti", {
			onEnd: () => {
				piece.remove()
			}
		})
	}
}

