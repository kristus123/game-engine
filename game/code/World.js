// ClientId(

export class World {
	constructor() {
		this.snow = Sprite.snow(Position(-0, 0), 7)
		this.objects = [
			this.snow.layers,
			this.player = DynamicGameObject(Position(0, 0)),
			this.a = Sprite.goat(this.player.position),
			this.snow.tilemaps,
		]

		this.a.tags.idle.loop()

		Camera.followInstantly(this.player)
		Controller.control(this.player)
	}

	update() {
		this.objects.update()

	}
}
