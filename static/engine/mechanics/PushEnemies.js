export class PushEnemies {

	constructor(player, hittableObjects) {
		this.angle = new Angle(player.position.center, 200, 300)
		this.splashParticles = new SplashParticles(player.position.center)

		this.localObjects = new LocalObjects([
			this.splashParticles,
			this.angle,
		])

		this.cooldown = 0

		this.chargedUp = 100

	}

	update() {
		this.cooldown += 10

		for (const o of this.hittableObjects) {
			if (
				Mouse.rightDown &&
				this.cooldown >= this.chargedUp &&
				this.angle.within(o.position.center)
			) {
				o.pushAway = true
			}
		}

		if (this.cooldown < this.chargedUp) {
			this.angle.color = this.angle.red
		}
		else {
			this.angle.color = this.angle.blue
		}

		if (Mouse.rightDown && this.cooldown >= this.chargedUp) {
			this.cooldown = 0
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		for (const o of this.hittableObjects) if (o.pushAway) {
			ForcePush(o).awayFrom(this.player, 20)
			this.cooldown = 0
			this.splashParticles.random(this.player.position.center, 'white')
			o.pushAway = false
		}
	}
}
