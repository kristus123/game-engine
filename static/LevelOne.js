import { Physics } from '/static/Physics.js';
import { Player } from '/static/Player.js';
import { Projectile } from '/static/Projectile.js';

export class LevelOne {
	constructor(camera) {
		this.camera = camera

		this.player = new Player()
		this.projectile = new Projectile(750, 360, 10, "red")

		this.physics = new Physics()
		this.physics.applyTo(this.player)
		this.physics.applyTo(this.projectile)

		document.addEventListener('click', (e) => {
			this.projectile.shoot(this.camera.mousePosition(e))
		})
	}

	runFrame(deltaTime, world) {

		this.physics.update(deltaTime)

		this.camera.context(() => {
			this.camera.follow(this.player) // Keep this after physics.update and within camera.context
			this.physics.objects.forEach(o => o.update(deltaTime))
			this.physics.objects.forEach(o => o.draw(world.ctx))
		})
	}
}
