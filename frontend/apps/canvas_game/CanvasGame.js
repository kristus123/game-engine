export class CanvasGame {
	constructor() {
		const p = Player(WorldPosition(0, 0))

		// const img = Dom.overlay(H.img("xxxxxx"))

		Light.add(p.position.center, 700)
		Controller.control(p)

		const objects = Objects([
			p,
			Sprite.world(WorldPosition(0, 0)).changeColors({
				"rgb(171,161,92)": "rgb(237,243,245)",
			}),
			// Snow(p.position),
		])
		CanvasLoop({
			update: () => {
				Camera.follow(p.position)
				// img.src = p.src
				objects.update()
			},
		})
	}
}
