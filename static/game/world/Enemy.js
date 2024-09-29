export class Enemy extends DynamicGameObject {
	constructor(position) {
		super(position, 1000, 10)

		this.position.width = 100
		this.position.height = 100

		this.localObjects = new LocalObjects([
			new Picture(this.position, '/static/assets/bad_ninja.png'),

			Init(this, {
				hp: new Hp(this, 100, 100),
				angle: new Angle(this.position.center, 100, 250),
			}),
			new PoopFace(this),
		])
	}

	update() {
		this.localObjects.update()
	}

	markBlinded() {
		this.blinded = true
		this.angle.color = this.angle.red

		setTimeout(() => {
			this.blinded = false
			this.angle.color = this.angle.blue
		}, 2_000);
	}

	kill() {
		this.handledBy.add(new class {
			constructor(position) {
				this.sprite = new TriggerSprite(position.offset(-200, -200, 500, 500), '/static/assets/kill_blood_animation_32x32.png', [
					// { x: 0, y: 0 },
					{ x: 1, y: 0 },
					{ x: 2, y: 0 },
					{ x: 3, y: 0 },
					{ x: 4, y: 0 },
					{ x: 5, y: 0 },
				], 50)

				this.sprite.play()
			}
			
			update() {
				if (this.sprite.pause) {
					this.removeFromLoop()
				}
			}

			draw(draw, guiDraw) {
				this.sprite.draw(draw, guiDraw)
			}
		}(this.position))

		this.removeFromLoop()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (this.blinded) {
			draw.text(this.position.offset(0, -100), '🫣')
		}
	}

}
