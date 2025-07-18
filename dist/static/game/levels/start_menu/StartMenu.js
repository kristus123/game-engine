import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { Level } from '/static/engine/core/Level.js'; 
import { Button } from '/static/engine/graphics/ui/Button.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { CinematicIntroLevel } from '/static/game/levels/cinematic_intro_level/CinematicIntroLevel.js'; 
import { D } from '/static/game/world/D.js'; 

export class StartMenu {
	constructor(level, camera) {

				AssertNotNull(level, "argument level in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(camera, "argument camera in " + this.constructor.name + ".js should not be null")
			
		this.level = level; 
		this.camera = camera; 

		this.startGame = new Button(new Position(0, -400, 400, 200), 'Start game', () => {
			this.level.change(new CinematicIntroLevel(this.level, this.camera))
		})

		this.settings = new Button(new Position(0, -150, 400, 200), 'Settings', () => {
			console.log('hei')
		})


		this.localObjects = new LocalObjects([
			new Picture(new DynamicGameObject(new Position(200, 0, 800, 800), 1, 1), '/static/assets/planets/exoplanet32x32.png'),
			this.startGame,
			this.settings,
		])
	}

	update() {
		this.level.change(new CinematicIntroLevel(this.level, this.camera))
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
