export function DrawLayer(depth) {
	const layer = CanvasLayer()
	Palette.addLayer(layer, depth)
	return Draw(layer.ctx)
}
