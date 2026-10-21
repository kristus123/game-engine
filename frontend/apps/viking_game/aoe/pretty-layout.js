const borderColors = ["#ff69b4", "#ffd166", "#06d6a0", "#4cc9f0"]
let borderColorIndex = 0

export default ({ html }) => {
	const border = html.firstElementChild
	border.style.transition = "border-color 300ms ease"

	G.onYear(year => {
		html.days.content = year
	})

	G.onWood(wood => {
		html.wood.content = wood
	})

	return {
		methods: {
			incrementDay: () => {
				// codex can i somehow trigger this programatically?
				// like this maybe?
				// Layout.pretty.incrementDay() ?
				// Layout.pretty.html.getId("hei")
			},
		},
		onPageOpen: () => {
			const color = borderColors[borderColorIndex++ % borderColors.length]
			border.style.borderColor = color
		},
		onPageClose: () => {
			border.style.borderColor = "transparent"
		},
	}
}
