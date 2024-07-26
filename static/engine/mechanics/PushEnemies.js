export class PushEnemies {

	constructor(player, hittableObjects) {
		this.angle = new Angle(player.position.center, 200, 300)
		this.splashParticles = new SplashParticles(player.position.center)



		this.sprite = new TriggerSprite(player.position.offset(100, 0, 200, 250), '/static/assets/explosion_32x32.png', [
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

		for (const o of this.hittableObjects) {
			if (o.pushAway) {
				ForcePush(o).awayFrom(this.player, 20)
				this.cooldown = 0
				this.localObjects.add(new TriggerSprite(o, '/static/assets/explosion_32x32.png', [
					{ x: 0, y: 0 },
					{ x: 1, y: 0 },
					{ x: 2, y: 0 },
					{ x: 3, y: 0 },
				], 50)).play()

				this.sprite.position = o.position
				this.sprite.play()

				o.pushAway = false
			}
		}
	}
}
