// ClientId(

export class World {
	constructor() {
		this.x = Sprite.snow(new Position(0,0))
	}

	update() {
		//this.x.update()
		console.log(this.x.tilemaps)
		this.x.layers.update()
	}

	draw(draw) {}
}
