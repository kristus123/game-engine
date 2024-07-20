export class Sword {
	constructor(player, hittableObjects) {
		this.angle = new Angle(player.position.center, 200)

		this.splash = new SplashParticles(player)
		this.localObjects = new LocalObjects([
			this.splash,
		])

		this.cooldown = 0
	}
	
	update() {
		this.cooldown += 1

		if (this.cooldown < 80) {
			this.angle.color = 'red'
		}
		else {
			this.angle.color = this.angle.blue
		}

		if (Mouse.down && this.cooldown >= 80) {
			this.cooldown = 0
		}

		for (const o of this.hittableObjects) {
			if (
				o.within(150, this.player.position.center) && 
				Mouse.down && 
				this.angle.isWithinAngle(o, 100) &&
				this.cooldown >= 80
			) {
				this.splash.random(o)
				o.removeFromLoop()
				this.cooldown = 0
			}
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.angle.draw(draw.ctx, 100)
		draw.splash(this.player, Mouse.position, 200)
		this.localObjects.draw(draw, guiDraw)
	}
}
