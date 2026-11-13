export default {
	page: { persistOnClose: false },
	onFirstDomAdd: ({ html }) => {
		html.viewer.add(H.create("viewer-page"))
	},
}
