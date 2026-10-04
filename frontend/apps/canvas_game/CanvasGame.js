export class CanvasGame {
	constructor() {
		const player = Player(WorldPosition(0, 0))

		// const img = Dom.overlay(H.img("xxxxxx"))

		Light.add(player.position.center, 300)
		Controller.control(player)

		const objects = Objects([
			player,
			Sprite.world(WorldPosition(0, 0)).changeColors({
				"171,161,92,255": "255,255,255,255",
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
