import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Dialogue } from '/static/engine/mechanics/dialogue/Dialogue.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { VoidDialogue } from '/static/game/levels/inside_level/VoidDialogue.js'; 
import { Player } from '/static/game/world/player/Player.js'; 

export class InsideLevel {
	constructor(level, camera) {

				AssertNotNull(level, "argument level in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(camera, "argument camera in " + this.constructor.name + ".js should not be null")
			
		this.level = level; 
		this.camera = camera; 


		this.player = new Player()
		Camera.follow(this.player)

		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			this.player,
			VoidDialogue(this.player),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
