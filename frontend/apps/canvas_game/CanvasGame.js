export class CanvasGame {

	constructor(options = {}) {
		const player = Player(WorldPosition(0, 0))

		Controller.control(player)
		Camera.follow(player.position)

		const world = Sprite.world(WorldPosition(0, 0)).changeColors({
			// "171,161,92,255": "255,255,255,255",
		}).setPixel(WorldPosition(2, 0, 1, 1))

		const objects = Objects([
			player,
			world,
			// Snow(player.position),
		])

		let x = 0
		let y = 0
		world.setPixel(WorldPosition(x++, y++))

		MainCanvas.init({
			update: () => {
				objects.update()
				const mousePixelPosition = WorldPosition(
					Math.floor((Mouse.position.x - world.position.x) / Scale.value),
					Math.floor((Mouse.position.y - world.position.y) / Scale.value)
				)

				for const p of world.picturesInGroup("D3") {
					p.setPixel(mousePixelPosition)
				}

			},
		})

		MainCanvas.add()
	}

}
