export const page = {
	persistOnClose: true,
}

export default async ({ html }) => {
	const previousShadowOpacity = Shadow.opacity
	Shadow.opacity = 0

	const canvasLoop = await CanvasLoop({
		drawMouseMarker: false,
		update: () => {
			const view = Camera.visiblePosition
			const cellSize = 48

			for let x = Math.floor(view.x / cellSize) * cellSize; x < view.x + view.width; x += cellSize {
				D1.rectangle(WorldPosition(x, view.y, 1, view.height), "rgba(57, 69, 44, 0.18)")
			}

			for let y = Math.floor(view.y / cellSize) * cellSize; y < view.y + view.height; y += cellSize {
				D1.rectangle(WorldPosition(view.x, y, view.width, 1), "rgba(57, 69, 44, 0.18)")
			}
		},
	}, html.worldCanvas, "#b7b47c")

	return {
		onDomAdd: () => {
			Shadow.opacity = 0
			canvasLoop.resume()
		},
		onDomRemove: () => {
			canvasLoop.pause()
			Shadow.opacity = previousShadowOpacity
		},
	}
}
