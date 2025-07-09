import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Bullet } from '/static/engine/mechanics/gun/Bullet.js'; 

export class Gun {
	constructor(player) {

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 

		this.bullets = []
		this.hittableObjects = []
	}

	onClick(position) {
		this.bullets.push(new Bullet(this, this.player.position.copy(), position.copy()))
	}

	update() {
		this.bullets.forEach(b => {
			b.update()
		})
	}

	draw(draw, guiDraw) {
		this.bullets.forEach(b => {
			b.draw(draw, guiDraw)
		})
	}

}
