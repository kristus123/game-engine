import { Draw } from '/static/Draw.js'
import { Controller } from '/static/Controller.js'
import { Physics } from '/static/Physics.js'

export class OutsideLevel {
	constructor(player, cameraFollow) {
		this.physics = new Physics()
		this.player = player
		this.physics.applyPhysics(this.player)

		this.controller = new Controller(player)
		this.cameraFollow = cameraFollow
	}

	active() {
		return this.player.x > 100
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	update() {
		this.controller.update()
		this.cameraFollow({
			x: 100,
			y: 0,
		})
	}

	draw(ctx) {
		Draw.text(ctx, 120, 0, 100, 100, 'outside level')
		this.player.draw(ctx)
	}
	
}
