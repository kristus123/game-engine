export class Gun {
	constructor(player) {
		this.bullets = []
		this.hittableObjects = []

		Mouse.addOnClick('shoot', position => {
			this.bullets.push(new Bullet(this, this.player, position))
		})
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
