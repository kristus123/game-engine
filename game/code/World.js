export class World {
	constructor() {

		this.snow = Sprite.snow(D2, Position(0, 0), 7)

		this.objects = Objects([
			Sprite.fire(D1, Position(800, 800), 2),
			this.snow.tilemaps,
			this.player = DynamicGameObject(Position(700, 700)),
			this.a = Sprite.goat(D2, this.player.position),
			Sprite.light(D1, this.player.position.offset(), 2),
		])

		this.a.tags.idle.loop()

		Camera.followInstantly(this.player)
		Controller.control(this.player)
	}

	update() {
		this.objects.update()
		this.snow.layers.trees.draw(D1)
		this.snow.layers.background.draw(D3)
	}
}
