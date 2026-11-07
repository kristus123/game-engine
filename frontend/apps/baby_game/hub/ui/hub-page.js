export default {
	page: {
		persistOnClose: true,
	},
	onFirstDomAdd: ({ html }) => {
		MouseDragScroll.horizontal(html.area, (x, y) => {
			const parallaxOffset = Math.round(-x * 0.25)
			html.grass.style.setProperty("--infinite-img-parallax-offset", `${parallaxOffset}px`)
			html.sun.style.setProperty("--infinite-img-parallax-offset", `${Math.round(-x * 0.1)}px`)
		})
		Iterate(10, () => {
			html.list.add(H.create("hub-card"))
		})
	},
}
