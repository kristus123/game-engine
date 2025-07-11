import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Distance } from '/static/engine/code_tools/misc/Distance.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Level } from '/static/engine/core/Level.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Audio } from '/static/engine/mechanics/audio/Audio.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Velocity } from '/static/engine/objects/Velocity.js'; 
import { Monologue } from '/static/game/levels/cinematic_intro_level/Monologue.js'; 
import { MainLevel } from '/static/game/levels/main_level/MainLevel.js'; 
import { World } from '/static/game/world/World.js'; 

export class CinematicIntroLevel {
	constructor(level, camera) {

				AssertNotNull(level, "argument level in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(camera, "argument camera in " + this.constructor.name + ".js should not be null")
			
		this.level = level; 
		this.camera = camera; 

		this.world = new World(level, camera)

		this.localObjects = new LocalObjects([
			this.world,
			new Monologue(this.world.deliveryDrone),
		])

		Audio.play()
	}

	update() {

		this.localObjects.update()

		if (Distance.withinRadius(this.world.deliveryDrone, this.world.player, 300)) {
			Controller.control(this.world.player)
			this.world.Camera.follow(this.world.player)
			this.world.deliveryDrone.resetVelocity()

			this.level.change(new MainLevel(this.level, this.world, this.camera))
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
