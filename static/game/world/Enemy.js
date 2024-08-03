export class Enemy extends DynamicGameObject {
	constructor(position) {
		super(position, 1000, 10)

		this.position.width = 100
		this.position.height = 100

		this.localObjects = new LocalObjects([
			new Picture(this.position, '/static/assets/bad_ninja.png'),

			Init(this, {
				hp: new Hp(this, 100, 100),
				sprite: new TriggerSprite(this.position.offset(-200,-200, 500, 500), '/static/assets/kill_blood_animation_32x32.png', [
					{ x: 0, y: 0 },
					{ x: 1, y: 0 },
					{ x: 2, y: 0 },
					{ x: 3, y: 0 },
					{ x: 4, y: 0 },
					{ x: 5, y: 0 },
				], 100),
			})
		])
	}

	update() {
		this.localObjects.update()

		if (this.hp.dead) {
			this.sprite.play()

			setTimeout(() => {
				this.removeFromLoop()
			}, 300);
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
