import { Player } from '/static/Player.js'
import { InsideLevel } from '/static/InsideLevel.js'
import { Controller } from '/static/Controller.js'
import { OutsideLevel } from '/static/OutsideLevel.js'

export class LevelHandler {
	constructor(cameraFollow) {

		this.player = new Player()
		this.controller = new Controller(this.player)

		this.insideLevel = new InsideLevel(this.player, cameraFollow)
		this.outsideLevel = new OutsideLevel(this.player, cameraFollow)

		this.levels = [
			this.insideLevel, 
			this.outsideLevel,
		]
	}

	updatePhysics(deltaTime) {
		this.levels.find(l => l.active()).updatePhysics(deltaTime)
	}

	update() {
		this.levels.find(l => l.active()).update()
	}

	drawCameraContext(ctx) {
		this.levels.find(l => l.active()).draw(ctx)
	}
}
