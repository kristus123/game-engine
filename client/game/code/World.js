export class World {
	constructor() {
		// Page.go(PracticePage)

		this.objects = Objects([
			Sprite.world(WorldPosition(0, 0)),
			Sprite.fireplace(WorldPosition(1512, 2100)),
			this.player = Player(WorldPosition(1200, 1200)),
		])

		Camera.follow(this.player)
		Controller.control(this.player)
	}

	update() {
		this.objects.update()

		D1.text(Mouse.position, `${Mouse.position.x} ${Mouse.position.y}`)
	}
}
