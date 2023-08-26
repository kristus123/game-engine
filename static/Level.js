import { Physics } from '/static/Physics.js'
import { Player } from '/static/Player.js'
import { Spaceship } from '/static/Spaceship.js'
import { EnterVehicleExtension } from '/static/EnterVehicleExtension.js'
import { SlingshotExtension } from '/static/SlingshotExtension.js'
import { EnterHouseExtension } from '/static/EnterHouseExtension.js'

export class Level {
	constructor(cameraFollow, mouse) {

		this.player = new Player()
		this.objectToFollow = this.player

		this.physics = new Physics()

		this.spaceship = new Spaceship(this.physics)

		this.physics.applyPhysics(this.player)
		this.physics.applyPhysics(this.spaceship)

		this.enterVehicleExtension = new EnterVehicleExtension(this.player, this.spaceship, cameraFollow)

		this.slingshotExtension = new SlingshotExtension(mouse, this.physics, this.player)
		this.enterHouseExtension = new EnterHouseExtension(this.player)
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	update() {
		this.spaceship.update()
		this.player.update()
		this.slingshotExtension.update()

		this.enterVehicleExtension.update()

		if (!this.enterVehicleExtension.entered) {
			this.enterHouseExtension.update()
		}
	}

	drawCameraContext(ctx) {
		this.slingshotExtension.draw(ctx)
		this.enterHouseExtension.draw(ctx)
		this.enterVehicleExtension.draw(ctx)
	}
}
