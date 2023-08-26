import { Draw } from '/static/Draw.js'
import { Controller } from '/static/Controller.js'
import { Physics } from '/static/Physics.js'

export class InsideLevel {
	constructor(player, cameraFollow) {
		this.physics = new Physics()
		this.player = player
		this.physics.applyPhysics(this.player)

		this.controller = new Controller(player)
		this.cameraFollow = cameraFollow
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	update() {
		this.controller.update()
		this.cameraFollow(this.player)
	}

	draw(ctx) {
		Draw.rectangle(ctx, 0, 0, 100, 100)
		this.player.draw(ctx)
	}
	
}
