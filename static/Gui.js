class Gui {
	
	draw(ctx, camera) {

		const p3 = camera.currentMousePosition
		Draw.text(ctx, p3.x, p3.y, 100, 50, "x: " + camera.currentMousePosition.x)
		Draw.text(ctx, p3.x, p3.y- 100, 100, 50, "y: " + camera.currentMousePosition.y)

		const p = camera.positionRelativeToScreen(50,  50)
		Draw.text(ctx, p.x, p.y, 100, 50, player.velocity.x)

		const p2 = camera.positionRelativeToScreen(200,  50)
		Draw.text(ctx, p2.x, p2.y, 100, 50, player.velocity.y)
	}
}
