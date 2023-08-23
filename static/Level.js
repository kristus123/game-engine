import { Physics } from '/static/Physics.js'
import { Player } from '/static/Player.js'
import { Projectile } from '/static/Projectile.js'

export class Level {
	constructor(mouse) {
		this.objectToFollow = {
			x:0,
			y:0,
		}

		this.physics = new Physics()

		this.player = new Player()
		this.physics.applyPhysics(this.player)

		this.projectile = new Projectile(750, 360, 10, "red")
		this.physics.applyPhysics(this.projectile)

		this.objects = [this.player, this.projectile]

		document.addEventListener('click', (e) => {
			this.projectile.shoot(mouse.positionRelativeToCamera(e))
		})
	}
}
