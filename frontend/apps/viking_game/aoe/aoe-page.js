export const page = {
	persistOnClose: true,
}

export default async ({ html }) => {
	CanvasGame(html.canvasArea)
	return {
	}
}
