export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

export default async ({ html }) => {
	CanvasGame(html.canvasArea)

	return {
		methods: {
			chopWood: () => {
				G.wood += 1
				if G.wood >= 5 {
					Page.open("viking-page")
				}
			},
			huntFood: () => {
				Page.open("viking-page")
			},
		},
		onPageOpen: () => html.play("pageEnterLeft"),
		onPageClose: () => html.play("pageExitLeft"),
	}
}
