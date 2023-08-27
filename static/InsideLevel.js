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

	active() {
		return this.player.x < 100
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	update() {
		this.controller.update()
		this.cameraFollow(this.player)
	}

	draw(ctx) {
		Draw.text(ctx, 0, 0, 100, 100, 'insideLevel')
		this.player.draw(ctx)

	}
	
}
