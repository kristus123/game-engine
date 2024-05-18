export class Fire extends DynamicGameObject {
	constructor(p) {
		super(p, 10, 10)
		this.position.width = 200
		this.position.height = 200

		const frameWidth = 96
		const frameHeight = 96
		const scale = 4

		const frameSequence = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },

			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 3, y: 1 },

			{ x: 0, y: 2 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 },
			{ x: 3, y: 2 },

			{ x: 0, y: 3 },
			{ x: 1, y: 3 },
			{ x: 2, y: 3 },
			{ x: 3, y: 3 },

			{ x: 0, y: 4 },
			{ x: 1, y: 4 },
			{ x: 2, y: 4 },
		]

		this.sprite = new Sprite(this.position, '/static/assets/particles/Fire+Sparks-SpriteSheet.png', frameWidth, frameHeight, scale, frameSequence)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.sprite.draw(draw, guiDraw)
	}
}
