import { Physics } from '/static/Physics.js'
import { Player } from '/static/Player.js'
import { Projectile } from '/static/Projectile.js'
import { Spaceship } from '/static/Spaceship.js'

export class Level {
	constructor(mouse) {
		this.physics = new Physics()

		this.player = new Player()
		this.spaceship = new Spaceship(this.player)
		this.physics.applyPhysics(this.player)
		this.physics.applyPhysics(this.spaceship)

		this.projectile = new Projectile(750, 360, 10, "red")
		this.physics.applyPhysics(this.projectile)

		document.addEventListener('click', (e) => {
			this.projectile.shoot(mouse.positionRelativeToCamera(e))
		})
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	cameraFollow() {
		return this.player
	}

	update() {
		this.player.update()
		this.projectile.update()
		this.spaceship.update()
	}

	drawCameraContext(ctx) {
		this.player.draw(ctx)
		this.projectile.draw(ctx)
		this.spaceship.draw(ctx)
	}

}
