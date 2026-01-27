// ClientId(

export class World {
	constructor() {
		this.x = Sprite.snow(Position(-0,0), 7)
		this.objects = [
			this.x,
			this.x.tilemaps,
			this.player = DynamicGameObject(Position(8000, 8000)),
			Sprite.player(this.player.position),
		]

		Camera.followInstantly(this.player)
		Controller.control(this.player)
	}

	update() {
		this.objects.update()
		D1.lightSource(Position(0, 0))
	}

	draw(draw) {}
}
