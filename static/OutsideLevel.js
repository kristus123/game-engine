import { Draw } from '/static/Draw.js'
import { Physics } from '/static/Physics.js'
import { Spaceship } from '/static/Spaceship.js'
import { FetchContainerExtension } from '/static/FetchContainerExtension.js'
import { EnterVehicleExtension } from '/static/EnterVehicleExtension.js'


export class OutsideLevel {
	constructor(player, cameraFollow) {
		this.physics = new Physics()
		this.player = player
		this.physics.applyPhysics(this.player)

		this.spaceship = new Spaceship()
		this.physics.applyPhysics(this.spaceship)

		this.enterVehicleExtension = new EnterVehicleExtension(this.player, this.spaceship, cameraFollow)
		this.fetchContainerExtension = new FetchContainerExtension(this.spaceship)
	}

	active() {
		return true
		// return this.player.x > 100
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	update() {
		this.enterVehicleExtension.update()
		this.fetchContainerExtension.update()
	}

	draw(ctx) {
		Draw.text(ctx, 120, 0, 100, 100, 'outside level')
		this.enterVehicleExtension.draw(ctx)
		this.fetchContainerExtension.draw(ctx)
	}
}
