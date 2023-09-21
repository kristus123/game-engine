import { Draw } from '/static/Draw.js'
import { Physics } from '/static/Physics.js'
import { Spaceship } from '/static/Spaceship.js'
import { FetchContainerExtension } from '/static/FetchContainerExtension.js'
import { EnterVehicleExtension } from '/static/EnterVehicleExtension.js'
import { Projectile } from '/static/Projectile.js'

export class OutsideLevel {
	constructor(player, cameraFollow, mouse) {
		this.physics = new Physics()
		this.player = player
		this.mouse = mouse
		this.projectile = new Projectile()
		this.physics.applyPhysics(this.projectile)
		this.physics.applyPhysics(this.player)

		this.spaceship = new Spaceship()
		this.physics.applyPhysics(this.spaceship)

		this.enterVehicleExtension = new EnterVehicleExtension(this.player, this.spaceship, cameraFollow)
		this.fetchContainerExtension = new FetchContainerExtension(this.spaceship)

		addEventListener('click', e => {
			this.projectile.shoot(this.player, mouse.positionRelativeToCamera(e))
		})
	}

	active() {
		return true
		// return this.player.x > 100
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	update() {
		if (this.projectile.connectedTo) {
			Physics.applyAttraction(this.player, this.projectile.connectedTo)
		}

		this.enterVehicleExtension.update()
		this.fetchContainerExtension.update()
	}

	draw(ctx) {
		Draw.text(ctx, 120, 0, 150, 100, 'outside level', "15px Arial", "white")
		this.enterVehicleExtension.draw(ctx)
		this.fetchContainerExtension.draw(ctx)
		this.projectile.draw(ctx)
	}
}
