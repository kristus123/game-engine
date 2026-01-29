// ClientId(

export class World {
	constructor() {
		this.snow = Sprite.snow(Position(-0, 0), 7)
		this.objects = [
			this.snow.layers,
			this.player = DynamicGameObject(Position(0, 0)),
			Sprite.player(this.player.position),
			this.snow.tilemaps,
		]

		Camera.followInstantly(this.player)
		Controller.control(this.player)
	}

	update() {
		this.objects.update()

	}
}
