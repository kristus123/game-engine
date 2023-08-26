import { Physics } from '/static/Physics.js'
import { Player } from '/static/Player.js'
import { Spaceship } from '/static/Spaceship.js'
import { EnterVehicleExtension } from '/static/EnterVehicleExtension.js'
import { SlingshotExtension } from '/static/SlingshotExtension.js'
import { EnterHouseExtension } from '/static/EnterHouseExtension.js'
import { InsideLevel } from '/static/InsideLevel.js'
import { Controller } from '/static/Controller.js'

export class LevelHandler {
	constructor(cameraFollow) {

		this.player = new Player()
		this.controller = new Controller(this.player)

		this.insideLevel = new InsideLevel(this.player, cameraFollow)
	}

	updatePhysics(deltaTime) {
		this.insideLevel.updatePhysics(deltaTime)
	}

	update() {
		this.insideLevel.update()
	}

	drawCameraContext(ctx) {
		this.insideLevel.draw(ctx)
	}
}
