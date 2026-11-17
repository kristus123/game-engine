export class CanvasGame {

	constructor(options = {}) {
		const player = Player(WorldPosition(0, 0))

		Controller.control(player)
		Camera.follow(player.position)

		const world = Sprite.world(WorldPosition(0, 0)).changeColors({
			"171,161,92,255": "255,255,255,255",
		}).setPixel(WorldPosition(2, 0, 1, 1))


		const h1 = `
			<overlay-fixed center-children>
				<div style="width: 200px; backdrop-filter: blur(19px); background: black">
					<h1>hei</h1>
				</div>
			</overlay-fixed>
		`.toHtml().css("color:white")

		const objects = Objects([
			PopOver(h1, () => {
				if Keyboard.w {
					return true
				}
			}),
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
					Math.floor((player.position.center.x - world.position.x) / Scale.value),
					Math.floor((player.position.center.y - world.position.y) / Scale.value)
				)

				for const p of world.picturesInGroup("D3") {
					p.setPixel(Random.direction(mousePixelPosition, 5), 171,161,92)
				}

			},
		})

		MainCanvas.add()
		Dom.add(h1)
	}

}
