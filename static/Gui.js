class Gui {
	
	draw(ctx, camera) {
		const p = camera.currentMousePosition
		Draw.text(ctx, p.x, p.y, 100, 50, "x: " + camera.currentMousePosition.x)
		Draw.text(ctx, p.x, p.y- 100, 100, 50, "y: " + camera.currentMousePosition.y)
	}
}
