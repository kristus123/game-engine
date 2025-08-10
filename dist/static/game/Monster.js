import { G } from '/static/engine/G.js'; 
import { Hp } from '/static/engine/Hp.js'; 
import { Init } from '/static/engine/Init.js'; 
import { Loop } from '/static/engine/Loop.js'; 
import { Sine } from '/static/engine/animation/Sine.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { SplashParticles } from '/static/engine/graphics/particles/SplashParticles.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Path } from '/static/engine/npc/Path.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Move } from '/static/engine/physics/Move.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class Monster extends DynamicGameObject {
	constructor(paths) {
		super(new Position(677, -644, 100, 100), 10, 10)

				AssertNotNull(paths, "argument paths in " + this.constructor.name + ".js should not be null")
			
		this.paths = paths; 


		this.localObjects = new LocalObjects([
			Init(this, {
				sine: new Sine(100, 0.1),
				hp: new Hp(this, () => {
					// this.removeFromLoop()
					// G.monsters.remove(m)
				}),
				path: new Path(this, paths),
				// splashParticles: new SplashParticles(),
				sprite: G.Sprite.enemy(this.position),
			}),
		])

		G.monsters.add(this)
	}

	update() {
		if (this.hp.dead) {
			this.removeFromLoop()
			G.monsters.remove(this)
			G.money += 1
		}

		this.localObjects.update()


		if (!this.path.completed) {
			Move(this).towards(this.path.position.center, 0.5)
		}
		else {
		}

		// this.splashParticles.random(this.position.center, "black")
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
