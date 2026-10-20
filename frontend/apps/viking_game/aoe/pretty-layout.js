const borderColors = ["#ff69b4", "#ffd166", "#06d6a0", "#4cc9f0"]
let borderColorIndex = 0

export default ({ html }) => {
	const border = html.firstElementChild
	border.style.transition = "border-color 300ms ease"

	return {
		onPageOpen: () => {
			const color = borderColors[borderColorIndex++ % borderColors.length]
			border.style.borderColor = color
		},
		onPageClose: () => {
			border.style.borderColor = "transparent"
		},
	}
}
