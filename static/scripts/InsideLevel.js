import { Draw } from '/static/scripts/Draw.js'
import { Controller } from '/static/scripts/Controller.js'
import { Physics } from '/static/scripts/Physics.js'
import { Particle } from '/static/scripts/Particle.js'

export class InsideLevel {
	constructor(player, cameraFollow) {
		this.physics = new Physics()
		this.player = player
		this.physics.applyPhysics(this.player)

		this.controller = new Controller(player)
		this.cameraFollow = cameraFollow

		this.particles = [
			new Particle(0, 0, 250, 5),
			new Particle(0, 0, 400, 3),
		]
	}

	active() {
		return this.player.x < 100
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
		this.particles.forEach(p => p.updatePhysics(deltaTime))
	}

	update() {
		this.particles.forEach(p => {
			p.x = this.player.x
			p.y = this.player.y
		})

		this.controller.update()
		this.particles.forEach(p => p.update())
		this.cameraFollow(this.player)
	}

	draw(ctx) {
		Draw.text(ctx, 0, 0, 100, 100, 'insideLevel', "25px Arial", "white")
		this.player.draw(ctx)
		this.particles.forEach(p => p.draw(ctx))

	}
	
}
