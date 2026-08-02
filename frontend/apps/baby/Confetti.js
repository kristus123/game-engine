const defaultColors = [
	"#ff595e",
	"#ffca3a",
	"#8ac926",
	"#1982c4",
	"#6a4c93",
	"#ff70a6",
	"#00c2a8",
	"#ff924c"
]

export function Confetti(element, colors=defaultColors) {
	const rect = element.getBoundingClientRect()

	const count = 40
	for (let i = 0; i < count; i++) {
		const piece = document.createElement("div")

		const angle = Math.random() * Math.PI * 2

		const speed = Math.random() * 300 + 150

		piece.x = rect.left + rect.width / 2
		piece.y = rect.top + rect.height / 2

		piece.addCssVariable("vx", `${Math.cos(angle) * speed}px`)
		piece.addCssVariable("vy", `${Math.sin(angle) * speed - 500}px`)

		piece.addCssVariable("color", Always.list(colors).random())

		Dom.add(piece)

		piece.play("confetti", {
			onEnd: () => {
				piece.remove()
			}
		})
	}
}

