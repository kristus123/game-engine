export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => {
	CanvasGame(html.canvasArea)
	const openModalDemo = () => {
		const modal = Assert.value(html.closest("pretty-layout").modal)
		modal.modalContent.innerHTML = `
			<div>
				<h2>Village modal</h2>
				<p>This is some basic HTML inside the custom modal.</p>
				<p>You can replace this content with your own layout, buttons, images, or game information.</p>
			</div>
		`
		modal.show()
	}

	return {
		methods: {
			openModalDemo,
			chopWood: () => {
				G.wood += 1
				Game.newActionTaken()
				if G.wood >= 5 {
					Page.open("viking-page")
				}
			},
			huntFood: () => {
				Page.open("viking-page")
			},
		},
		onPageOpen: () => {
			html.play("pageEnterLeft")
			openModalDemo()
		},
		onPageClose: () => html.play("pageExitLeft"),
	}
}
