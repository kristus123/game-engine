import { Draw } from '/static/Draw.js'
import { Physics } from '/static/Physics.js'
import { Spaceship } from '/static/Spaceship.js'
import { Distance } from '/static/Distance.js'
import { EnterVehicleExtension } from '/static/EnterVehicleExtension.js'


export class OutsideLevel {
	constructor(player, cameraFollow) {
		this.physics = new Physics()
		this.player = player
		this.physics.applyPhysics(this.player)

		this.spaceship = new Spaceship()
		this.physics.applyPhysics(this.spaceship)

		this.enterVehicleExtension = new EnterVehicleExtension(this.player, this.spaceship, cameraFollow)
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
		this.spaceship.update()
	}

	draw(ctx) {
		Draw.text(ctx, 120, 0, 100, 100, 'outside level')
		this.player.draw(ctx)
		this.enterVehicleExtension.draw(ctx)
	}
}
