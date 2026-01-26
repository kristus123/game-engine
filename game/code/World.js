// ClientId(

export class World {
	constructor() {
		this.objects = [
			this.player = DynamicGameObject(Position(0, 0)),
			Sprite.snow(Position(-1000, -1000)),
			Sprite.player(this.player.position),
		]
		Controller.control(this.player)
	}

	update() {
		this.objects.update()
		D1.lightSource(Position(0, 0))
	}

	draw(draw) {}
}
