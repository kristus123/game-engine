export class Gun {
	constructor(player, mouse) {
		this.bullets = []

		this.mouse.addOnClick('shoot', mousePosition => {
			this.shoot(mousePosition)
		})
	}

	shoot(position) {
		const b = new Bullet(this.player, position)

		this.bullets.push(b)

		return b
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.bullets.forEach(b => {
			b.draw(draw, guiDraw)
		})
	}

}
