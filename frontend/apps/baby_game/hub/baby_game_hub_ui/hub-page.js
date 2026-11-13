export default {
	page: {
		persistOnClose: true,
	},
	fields: () => ({
		dragScroll: null,
		scrollLeft: 0,
	}),
	onFirstDomAdd: ({ html }) => {
		html.fields.dragScroll = MouseDragScroll.horizontal(html.area, (x) => {
			if !html.isConnected {
				return
			}

			html.fields.scrollLeft = x
			const parallaxOffset = Math.round(-x * 0.2)
			html.grass.style.setProperty("--infinite-img-parallax-offset", `${parallaxOffset}px`)
			html.sun.style.setProperty("--infinite-img-parallax-offset", `${Math.round(-x * 0.1)}px`)
		})

		for const [key, game] of Object.entries(Frontend.mini_games) {
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
	onDomAdd: ({ html }) => {
		html.fields.dragScroll.scroll = html.fields.scrollLeft
	},
	onDomRemove: ({ html }) => {
		html.fields.dragScroll.stop()
	},
	methods: {
		openModalTest: () => Page.openAsModalFixed("modal-test-page"),
	},
}
