import { Player } from '/static/scripts/Player.js'
import { InsideLevel } from '/static/scripts/InsideLevel.js'
import { Controller } from '/static/scripts/Controller.js'
import { OutsideLevel } from '/static/scripts/OutsideLevel.js'

export class LevelHandler {
	constructor(cameraFollow, mouse) {

		this.player = new Player()
		this.controller = new Controller(this.player)

		this.insideLevel = new InsideLevel(this.player, cameraFollow)
		this.outsideLevel = new OutsideLevel(this.player, cameraFollow, mouse)

		this.levels = [
			// this.insideLevel, 
			this.outsideLevel,
		]
	}

	updatePhysics(deltaTime) {
		this.levels.find(l => l.active()).updatePhysics(deltaTime)
	}

	update() {
		this.levels.find(l => l.active()).update()
	}

	draw(ctx) {
		this.levels.find(l => l.active()).draw(ctx)
	}
}
