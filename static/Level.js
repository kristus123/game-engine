import { Physics } from '/static/Physics.js'
import { Player } from '/static/Player.js'
import { Projectile } from '/static/Projectile.js'
import { Spaceship } from '/static/Spaceship.js'
import { VehicleModule } from '/static/VehicleModule.js'

export class Level {
	constructor(mouse) {

		this.player = new Player()
		this.objectToFollow = this.player

		this.spaceship = new Spaceship()

		this.projectile = new Projectile(750, 360, 10, "red")

		this.physics = new Physics()
		this.physics.applyPhysics(this.player)
		this.physics.applyPhysics(this.spaceship)
		this.physics.applyPhysics(this.projectile)

		document.addEventListener('click', (e) => {
			this.projectile.shoot(mouse.positionRelativeToCamera(e))
		})

		this.vehicleModule = new VehicleModule(this.player, this.spaceship, this)
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	update() {
		this.player.update()
		this.projectile.update()
		this.spaceship.update()

		this.vehicleModule.update()
	}

	drawCameraContext(ctx) {
		this.projectile.draw(ctx)
		this.vehicleModule.draw(ctx)
	}

}