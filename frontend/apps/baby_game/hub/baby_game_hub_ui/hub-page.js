export default {
	page: {
		persistOnClose: true,
	},
	fields: () => ({
		dragScroll: null,
		x: 0,
	}),
	onFirstDomAdd: ({ html, fields }) => {
		fields.dragScroll = MouseDragScroll.horizontal(html.area, (x) => {
			if html.isConnected {
				fields.x = x
				const parallaxOffset = Math.round(-x * 0.2)
				html.grass.style.setProperty("--infinite-img-parallax-offset", `${parallaxOffset}px`)
				html.sun.style.setProperty("--infinite-img-parallax-offset", `${Math.round(-x * 0.1)}px`)
			}
		})

		for const [key, game] of Frontend.mini_games.all {
			if game == null || typeof game != "object" {
				continue
			}

			const pageFile = Object.keys(game).find(name => name.endsWith("-page.html"))
			html.list.add(H.create("hub-card", {
				data: {
					name: key,
					page: pageFile ? pageFile.replace(".html", "") : "",
				},
			}))
		}
	},
	onDomAdd: ({ fields }) => {
		fields.dragScroll.scroll = fields.x
	},
	onDomRemove: ({ fields }) => {
		fields.dragScroll.stop()
	},
	methods: {
		openModalTest: () => Page.openAsModalFixed("modal-test-page"),
	},
}
