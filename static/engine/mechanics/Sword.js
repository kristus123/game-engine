export class Sword {
	constructor(player, hittableObjects) {
		this.angle = new Angle(player.position.center, 100, 250)

		this.splash = new SplashParticles(player)
		this.localObjects = new LocalObjects([
			this.splash,
			this.angle,
		])

		this.cooldown = 0
	}

	update() {
		this.cooldown += 10

		for (const o of this.hittableObjects) {

			if (
				Mouse.down &&
				this.cooldown >= 80 &&
				this.angle.within(o)
			) {
				o.kill = true
			}
		}

		if (this.cooldown < 80) {
			this.angle.color = 'red'
		}
		else {
			this.angle.color = this.angle.blue
		}

		if (Mouse.down && this.cooldown >= 80) {
			this.cooldown = 0
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		draw.splash(this.player, Mouse.position, 200)
		this.localObjects.draw(draw, guiDraw)

		for (const o of this.hittableObjects) if (o.kill) {
			this.splash.towards(this.player)
			o.removeFromLoop()
			List.remove(this.hittableObjects, o)
			this.cooldown = 0

		}
	}
}
