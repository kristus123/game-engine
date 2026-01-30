// ClientId(

export class World {
	constructor() {
		this.snow = Sprite.snow(D2, Position(-0, 0), 7)

		this.objects = [
			this.player = DynamicGameObject(Position(0, 0)),
			this.a = Sprite.goat(D2, this.player.position),
			this.s = this.player.position.smooth(),
		]

		this.a.tags.idle.loop()

		Camera.followInstantly(this.player)
		Controller.control(this.player)
	}

	update() {
		this.objects.update()
		this.snow.layers.trees.draw(D1)
		this.snow.layers.background.draw(D3)
		D1.circle(this.s)
	}
}
