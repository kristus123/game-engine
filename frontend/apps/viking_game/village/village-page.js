export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default {
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
	onPageOpen: async (html) => {
		await html.play("pageEnterLeft")
	},
	onPageClose: (html) => html.play("pageExitLeft"),
}
