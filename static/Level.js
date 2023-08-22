import { Physics } from '/static/Physics.js';
import { Player } from '/static/Player.js';
import { Projectile } from '/static/Projectile.js';
import { Spaceship } from '/static/Spaceship.js';

export class Level {
	constructor(camera) {
		this.camera = camera

		this.player = new Player()
		this.spaceship = new Spaceship(this.player)

		this.projectile = new Projectile(750, 360, 10, "red")

		this.physics = new Physics()
		this.physics.applyTo(this.player)
		this.physics.applyTo(this.projectile)
		this.physics.applyTo(this.spaceship)

		document.addEventListener('click', (e) => {
			this.projectile.shoot(this.camera.mousePosition(e))
		})
	}

	runFrame(deltaTime, world) {

		this.physics.update(deltaTime)

		this.camera.context(() => {
			this.camera.follow(this.player) // Keep this after physics.update and within camera.context
			this.physics.objects.forEach(o => o.update())
			this.physics.objects.forEach(o => o.draw(world.ctx)) // needs to be inside camera.context as well
		})
	}
}
