export class CanvasGame {
	constructor() {
		const player = Player(WorldPosition(2000, 2000))

		Controller.control(player)

		const objects = Objects([
			player,
			Sprite.world(WorldPosition(0, 0)).changeColors({
				// "171,161,92,255": "255,255,255,255",
			}),
			Snow(player.position),
		])

		CanvasLoop({
			update: () => {
				Camera.follow(player.position)
				// img.src = player.src
				objects.update()
			},
		})
	}
}
