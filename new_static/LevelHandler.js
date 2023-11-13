import { Player } from '/static/Player.js'
import { Controller } from '/static/Controller.js'
import { OutsideLevel } from '/static/OutsideLevel.js'

export class LevelHandler {
	constructor(cameraFollow, mouse) {
		this.player = new Player()
		this.controller = new Controller(this.player)

		this.outsideLevel = new OutsideLevel(this.player, cameraFollow, mouse)
	}

	updatePhysics(deltaTime) {
		this.outsideLevel.updatePhysics(deltaTime)
	}

	update() {
		this.outsideLevel.update()
	}

	draw(ctx) {
		this.outsideLevel.draw(ctx)
	}
}
