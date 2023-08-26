import { Draw } from '/static/Draw.js'
import { Controller } from '/static/Controller.js'
import { Physics } from '/static/Physics.js'

export class OutsideLevel {
	constructor(player) {
		this.physics = new Physics()
		this.player = player
		this.physics.applyPhysics(this.player)

		this.controller = new Controller(player)
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	update() {
		this.controller.update()
	}

	draw(ctx) {
		Draw.rectangle(ctx, -100, 0, 100, 100)
		Draw.text(ctx, -100, 0, 100, 100, 'outside level')
		this.player.draw(ctx)
	}
	
}
