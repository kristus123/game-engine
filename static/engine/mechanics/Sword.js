export class Sword {

	constructor(player) {
		this.angle = new Angle(player.position.center, 100, 250)

		this.splashParticles = new SplashParticles(player)


		this.sprite = new TriggerSprite(player.position.offset(100, 0, 200, 250), '/static/assets/sword_swing_32x32.png', [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
		], 50)

		this.localObjects = new LocalObjects([
			this.splashParticles,
			this.angle,
			this.sprite,
		])

		this.cooldown = 0

		this.chargedAt = 500

		this.killedObjecs = []
	}

	update() {
		this.cooldown += 10

		for (const o of Registry.enemies) {
			if (
				Mouse.down &&
				this.cooldown >= this.chargedAt &&
				this.angle.within(o.position.center)
			) {
				console.log('kill')
				this.killedObjecs.push(o)
			}
		}

		if (this.cooldown < this.chargedAt) {
			this.angle.color = this.angle.red
		}
		else {
			this.angle.color = this.angle.blue
		}

		if (Mouse.down && this.cooldown >= this.chargedAt) {
			this.cooldown = 0
			this.sprite.play()
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		for (const o of this.killedObjecs) {
			o.killAnimation()
			console.log('hei')
			this.cooldown = 0
		}
		this.killedObjecs = []
	}
}
