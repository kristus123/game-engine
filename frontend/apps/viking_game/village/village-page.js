export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => {
	const openModalDemo = () => {
		const modal = Assert.value(html.modal)
		modal.show()
	}

	return {
		methods: {
			openModalDemo,
			chopWood: () => {
				G.chopWood()
			},
			huntFood: () => {
				Page.open("viking-page")
			},
		},
		onPageOpen: async () => {
			await html.play("pageEnterLeft")
		},
		onPageClose: () => html.play("pageExitLeft"),
	}
}
