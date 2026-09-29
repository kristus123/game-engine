export class CanvasGame {
	constructor() {
		const objects = Objects([
			// Sprite.ally(WorldPosition(0,0))
		])
		CanvasLoop({
			update: () => {
				objects.update()
				console.log("hei")
			},
		})
	}
}
