// ClientId(

export class World {
	constructor() {
		this.x = Sprite.snow(new Position(0,0))

		Camera.follow(Mouse.position)
	}

	update() {
		this.x.update()
		//this.x.layers.update()
		this.x.tilemaps.update()
	}

	draw(draw) {}
}
