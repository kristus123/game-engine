import { Physics } from '/static/Physics.js'
import { Player } from '/static/Player.js'
import { Spaceship } from '/static/Spaceship.js'
import { EnterVehicleExtension } from '/static/EnterVehicleExtension.js'
import { SlingshotExtension } from '/static/SlingshotExtension.js'

export class Level {
	constructor(mouse) {

		this.player = new Player()
		this.objectToFollow = this.player

		this.physics = new Physics()

		this.spaceship = new Spaceship(this.physics)

		this.physics.applyPhysics(this.player)
		this.physics.applyPhysics(this.spaceship)

		this.enterVehicleExtension = new EnterVehicleExtension(this.player, this.spaceship, this)
		
		this.slingshotExtension = new SlingshotExtension(mouse, this.physics, this.player)
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	update() {
		this.spaceship.update()
		this.player.update()
		this.slingshotExtension.update()

		this.enterVehicleExtension.update()
	}

	drawCameraContext(ctx) {
		this.enterVehicleExtension.draw(ctx)
		this.slingshotExtension.draw(ctx)
	}

}
