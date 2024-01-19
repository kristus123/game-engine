export class Gun {
	constructor(player, mouse) {
		this.player = player

		this.mouse = mouse

		this.bullets = []

		this.mouse.addOnClick('shoot', (mousePosition) => {
			this.shoot(mousePosition)
		})
	}

	shoot(position) {
		const b = new Bullet(this.player, position)

		this.bullets.push(b)

		return b
	}

	draw(draw) {
		this.bullets.forEach(b => {
			b.draw(draw)
		})
	}

}
