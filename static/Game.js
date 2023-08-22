import { Physics } from '/static/Physics.js';
import { Player } from '/static/Player.js';
import { Projectile } from '/static/Projectile.js';
import { Spaceship } from '/static/Spaceship.js';

export class Game {
	constructor() {
		this.player = new Player()
		this.spaceship = new Spaceship(this.player)
		this.projectile = new Projectile(750, 360, 10, "red")

		document.addEventListener('click', (e) => {
			this.projectile.shoot(this.camera.mousePosition(e))
		})
	}


	update() {
		
	}

}
