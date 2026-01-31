export class World {
	constructor() {
		this.snow = Sprite.snow(D2, Position(-0, 0), 7)

		this.objects = [
			Sprite.fire(D2, Position(800, 800), 1),
			this.player = DynamicGameObject(Position(0, 0)),
			this.a = Sprite.goat(D2, this.player.position),
			this.s = Mouse.position.smooth(0.1),
		]

		this.s.actualPosition.x -= 100

		this.a.tags.idle.loop()

		Camera.followInstantly(this.player)
		Controller.control(this.player)
	}

	update() {
		this.objects.update()
		this.snow.layers.trees.draw(D1)
		this.snow.layers.background.draw(D3)
		D1.circle(this.s.actualPosition)
	}
}
