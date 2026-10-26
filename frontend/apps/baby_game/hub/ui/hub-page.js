export const page = {
	persistOnClose: true,
}

export default {
	onFirstDomAdd: (html) => {
		MouseDragScroll.horizontal(html.area)
		Iterate(10, () => {
			html.list.add(H.create("hub-card"))
		})
	},
}
