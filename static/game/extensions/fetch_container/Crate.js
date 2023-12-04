export class Crate extends GameObject {
	constructor(position) {
		super(position.x, position.y, 200, 100, 50, 300)
		this.crateImage = new Picture('https://cdn-icons-png.flaticon.com/512/6618/6618414.png')
	}

	update() {
		
	}

	onCollision(o) {
		Push(this).awayFrom(o, 1.1)
	}

	draw(ctx) {
		this.crateImage.draw(ctx, {x: this.x, y:this.y}, 200)
		super.draw(ctx)
	}
	
}
