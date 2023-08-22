import { Physics } from '/static/Physics.js';
import { Player } from '/static/Player.js';
import { Projectile } from '/static/Projectile.js';
import { Spaceship } from '/static/Spaceship.js';

export class Level {
	constructor(camera) {
		this.camera = camera

		this.player = new Player()
		this.spaceship = new Spaceship(this.player)
		this.projectile = new Projectile(750, 360, 10, "red")

		this.objects = [this.player, this.projectile, this.spaceship]

		this.physics = new Physics(
			[this.player, this.projectile, this.spaceship])

		document.addEventListener('click', (e) => {
			this.projectile.shoot(this.camera.mousePosition(e))
		})
	}
}
