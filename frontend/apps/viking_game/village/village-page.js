export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => {
	CanvasGame(html.canvasArea)
	const openModalDemo = () => {
		const modal = Assert.value(html.modal)
		modal.show()
	}

	return {
		methods: {
			openModalDemo,
			chopWood: () => {
				G.wood += 1
				Game.newActionTaken()
				FloatingHtml.add(`
					<div style="color: white; font-size: 30px;">
						+1 wood
					</div>
				`.toHtml())

				if G.wood >= 5 {
					Page.open("viking-page")
				}
			},
			huntFood: () => {
				Page.open("viking-page")
			},
		},
		onPageOpen: async () => {
			await html.play("pageEnterLeft")
			openModalDemo()
		},
		onPageClose: () => html.play("pageExitLeft"),
	}
}
