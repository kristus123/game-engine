export class CanvasGame {

	constructor() {
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


		CanvasLoop({
			update: () => {
				objects.update()

				for const p of world.picturesInGroup("D3") {
					p.setPixel(Mouse.position)
				}

			},
		})
	}

}
