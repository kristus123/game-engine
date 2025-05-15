export class ChickenSprites {

	constructor(chicken) {
		this.idleSprite = new Sprite(chicken, '/static/assets/sprites/chicken_sprite_32x32.png', [
			{ x: 1, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 3, y: 3 },
		])

		this.eatingSprite = new TriggerSprite(chicken, '/static/assets/sprites/chicken_eating_38x32.png', [
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
			{ x: 4, y: 0 },
			{ x: 5, y: 0 },
			{ x: 6, y: 0 },
			{ x: 7, y: 0 },
			{ x: 8, y: 0 },
		])
	}

	eat() {
		this.eatingSprite.play()
	}

	kill() {
		this.killedSprite = new Killed(this.chicken)
	}

	update() {
	}

	draw(draw, guiDraw) {
		if (this.killedSprite) {
			this.killedSprite.draw(draw, guiDraw)

			draw.pink(this.position)
			this.chicken.velocity.reset()
		}
		else {
			if (this.eatingSprite.playing) {
				this.eatingSprite.draw(draw, guiDraw)
				this.velocity.reset()
			}
			else {
				this.idleSprite.draw(draw, guiDraw)
			}
		}
	}
}
