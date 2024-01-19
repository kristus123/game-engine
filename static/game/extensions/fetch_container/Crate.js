export class Crate extends GameObject {
	constructor(position) {
		super(position.x, position.y, 200, 200, 50, 300)
		this.crateImage = new Picture(this, 'https://cdn-icons-png.flaticon.com/512/6618/6618414.png')
	}

	update() {

	}

	onCollision(o) {
		Push(this).awayFrom(o, 1.1)
	}

	draw(draw) {
		super.draw(draw)
		this.crateImage.draw(draw, 200)
		draw.new_circle(this.position.center)
	}

}
