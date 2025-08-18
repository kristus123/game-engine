import { G } from '/static/engine/G.js'; 
import { MinCap } from '/static/engine/MinCap.js'; 
import { Sine } from '/static/engine/animation/Sine.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { PathFinder } from '/static/engine/mechanics/PathFinder.js'; 
import { Path } from '/static/engine/npc/Path.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { OnChange } from '/static/engine/on/OnChange.js'; 
import { Move } from '/static/engine/physics/Move.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 100)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.path = new PathFinder(this, new Position(0,0)),
			G.invisibleWalls,
			new OnChange(() => this.friend && this.within(100, this.friend), dance => {
				this.dance = dance
			}),
			this.sine = new Sine(2, 0.5),
		])

		const otherAlly = G.allies.anyExcept(this)
		if (otherAlly) {
			this.friend = otherAlly
			otherAlly.friend = this

			this.path.target = this.friend
			otherAlly.path.target = this
		}

		G.allies.add(this)
	}

	update() {
		if (this.path.success) {
			console.log('heihei')
		}

		if (!this.within(10, this.path.current)) {
			Move(this).towards(this.path.current, 1)
		}
		else {
			const m = this.withinAny(10000, G.monsters)
			if (m) {
				console.log("attack")
				this.path.target = m
			}
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (this.dance) {
			this.position.scale(MinCap(0.5, this.sine.value))
		}
	}

}
