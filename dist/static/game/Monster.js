import { G } from '/static/engine/G.js'; 
import { Hp } from '/static/engine/Hp.js'; 
import { Init } from '/static/engine/Init.js'; 
import { Loop } from '/static/engine/Loop.js'; 
import { Sine } from '/static/engine/animation/Sine.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Path } from '/static/engine/npc/Path.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { OnTrue } from '/static/engine/on/OnTrue.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { DeathText } from '/static/game/DeathText.js'; 
import { Money } from '/static/game/Money.js'; 

export class Monster extends DynamicGameObject {
	constructor(paths, onKill=() => {}) {
		super(new Position(677, -644, 100, 100), 10, 10)

				AssertNotNull(paths, "argument paths in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onKill, "argument onKill in " + this.constructor.name + ".js should not be null")
			
		this.paths = paths; 
		this.onKill = onKill; 


		this.localObjects = new LocalObjects([
			Init(this, {
				sine: new Sine(100, 0.1),
				hp: new Hp(this, () => {
					this.onKill()
					Money.increase(1)
					this.removeFromLoop()
				}),
				path: new Path(this, paths),
				sprite: G.Sprite.enemy(this.position),
			}),

			new OnTrue(() => this.touches(paths.at(-1)), () => {
				DeathText.show('You lose', 9000)
			}),
		])

		G.monsters.add(this)


		this.hp.currentHp += G.wave * 2
		this.hp.maxHp += G.wave * 2

		this.hp.currentHp *= 0.6
		this.hp.maxHp *= 0.6
	}

	update() {
		this.localObjects.update()

		if (!this.path.completed) {
			this.moveTowards(this.path.position.center)
		}
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
