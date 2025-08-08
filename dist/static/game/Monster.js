import { G } from '/static/engine/G.js'; 
import { Hp } from '/static/engine/Hp.js'; 
import { Init } from '/static/engine/Init.js'; 
import { Loop } from '/static/engine/Loop.js'; 
import { Sine } from '/static/engine/animation/Sine.js'; 
import { SplashParticles } from '/static/engine/graphics/particles/SplashParticles.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Path } from '/static/engine/npc/Path.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Move } from '/static/engine/physics/Move.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class Monster extends DynamicGameObject {
	constructor() {
		super(new Position(677, -644, 100, 100), 10, 10)



		this.localObjects = new LocalObjects([
			Init(this, {
				sine: new Sine(100, 0.1),
				hp: new Hp(this, () => {
					this.removeFromLoop()
				}),
				path: new Path(this, [
					new Position(677,-653),
					new Position(800, 80),
					new Position(140, 618),
					new Position(-800, 2),
				]),
				// splashParticles: new SplashParticles(),
				sprite: G.Sprite.enemy(this.position),
			}),
		])

		G.monsters.add(this)
	}

	update() {
		this.localObjects.update()


		if (!this.path.completed) {
			Move(this).towards(this.path.position)
		}
		else {
		}

		// this.splashParticles.random(this.position.center, "black")
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
