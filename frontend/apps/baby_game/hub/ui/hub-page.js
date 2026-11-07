export default {
	page: {
		persistOnClose: true,
	},
	onFirstDomAdd: ({ html }) => {
		MouseDragScroll.horizontal(html.area)
		Iterate(10, () => {
			html.list.add(H.create("hub-card"))
		})
	},
}
