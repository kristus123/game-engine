import { Projectile } from '/static/scripts/Projectile.js'
import { Physics } from '/static/scripts/Physics.js'

export class SlingshotExtension {
	constructor(mouse, physics, player) {
		this.player = player

		this.projectile = new Projectile(this.player, 10, "red")
		physics.applyPhysics(this.projectile)

		document.addEventListener('click', (e) => {
			console.log("shooting")
			this.projectile.shoot(this.player, mouse.positionRelativeToCamera(e))
		})
	}

	update() {
		if (this.projectile.connectedTo) {
			Physics.enforceMaxDistance(this.player, this.projectile.connectedTo)
		}
	}

	draw(ctx) {
		this.projectile.draw(ctx)
	}
}
