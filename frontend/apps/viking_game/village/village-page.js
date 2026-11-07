export default {
	page: {
		persistOnClose: true,
		layout: "pretty-layout",
	},
	methods: {
		openModalDemo: (html) => {
			const modal = Assert.value(html.modal)
			modal.show()
		},
		chopWood: () => {
			G.chopWood()
		},
		huntFood: () => {
			Page.open("viking-page")
		},
	},
	onDomAdd: async ({ html }) => {
		await html.play("pageEnterLeft")
	},
	onDomRemove: ({ html }) => html.play("pageExitLeft"),
}
