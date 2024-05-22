export class Gun {
	constructor(player, mouse) {
		this.bullets = []
		this.hittableObjects = []

		/*this.mouse.addOnClick('shoot', position => {
			this.bullets.push(new Bullet(this, this.player, position))
		})*/
	}

	update() {
		this.bullets.forEach(b => {
			b.update()
		})
	}

	draw(draw, guiDraw) {
		this.bullets.forEach(b => {
			b.draw(draw, guiDraw)
		})
	}

}
