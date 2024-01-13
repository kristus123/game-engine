
export class Chicken extends GameObject {
	constructor() {
		super(-1500, -400, 150, 150, 10, 10)

		const frameWidth = 32
		const frameHeight = 32
		const scale = 5;
		const frameSequence = [
			{ x: 1, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 3, y: 3 },
		]

		this.sprite = new Sprite('/static/assets/Chicken_Sprite_Sheet.png', this, frameHeight, frameWidth, scale, frameSequence)

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
