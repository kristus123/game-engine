export class Chicken extends GameObject {
	constructor() {
		super(-1800, -200, 150, 150, 10, 10)

		this.sprite = new Sprite(this, '/static/assets/Chicken_Sprite_Sheet.png')
	}

	onCollision(o) {
		Push(this).awayFrom(o, 50)
	}

	update() {
	}

	draw(ctx) {
		this.sprite.draw(ctx)
	}
}
