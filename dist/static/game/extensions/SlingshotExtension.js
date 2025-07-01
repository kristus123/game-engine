import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Distance } from '/static/engine/code_tools/misc/Distance.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Physics } from '/static/engine/core/physics/Physics.js'; 
import { Projectile } from '/static/game/legacy/Projectile.js'; 

export class SlingshotExtension {
	constructor(player) {

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 

		this.projectile = new Projectile(player, 10, 'red')

		document.addEventListener('click', (e) => {
			this.projectile.shoot(
				player,
				Mouse.positionRelativeToCamera.ra(e),
			)
		})
	}

	update() {
		if (this.projectile.connectedTo) {
			Physics.enforceMaxDistance(this.player, this.projectile.connectedTo)
		}
	}

	draw(draw, guiDraw) {
		this.projectile.draw(draw, guiDraw)
	}
}
