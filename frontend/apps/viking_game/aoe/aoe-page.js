export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => {
	CanvasGame(html.canvasArea)

	const animatePage = keyframes => {
		const animation = html.animate(keyframes, {
			duration: 450,
			easing: "ease-in-out",
			fill: "both",
		})
		return animation.finished.finally(() => animation.cancel())
	}

	return {
		methods: {
			chopWood: () => {
				G.wood += 1	
				if (G.wood >= 5) {
					Page.open("viking-page")
				}
			},
			huntFood: () => {
				Page.open("viking-page")
			},
		},
		onPageOpen: () => animatePage([
			{ opacity: 0, transform: "translateX(-36px) scale(0.97)", filter: "blur(4px)" },
			{ opacity: 1, transform: "translateX(0) scale(1)", filter: "blur(0)" },
		]),
		onPageClose: () => animatePage([
			{ opacity: 1, transform: "translateX(0) scale(1)", filter: "blur(0)" },
			{ opacity: 0, transform: "translateX(-36px) scale(0.97)", filter: "blur(4px)" },
		]),
	}
}
