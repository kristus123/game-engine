export class Sword {
	constructor(player, hittableObjects) {
		this.angle = new Angle(player.position.center, 200)

		this.splash = new SplashParticles(player, hittableObjects[0])
		this.localObjects = new LocalObjects([
			this.splash,
		])
	}
	
	update() {
		for (const o of this.hittableObjects) {
			if (o.within(150, this.player.position.center) && Mouse.down && this.angle.isWithinAngle(o, 100)) {
				this.splash.random(o)
				o.removeFromLoop()
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
