import { G } from '/static/engine/G.js'; 
import { MinCap } from '/static/engine/MinCap.js'; 
import { Sine } from '/static/engine/animation/Sine.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { PathFinder } from '/static/engine/mechanics/PathFinder.js'; 
import { Path } from '/static/engine/npc/Path.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { After } from '/static/engine/on/After.js'; 
import { OnChange } from '/static/engine/on/OnChange.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 

export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 100)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.pathFinder = new PathFinder(this, G.player),
			G.invisibleWalls,
			new OnChange(() => this.friend && this.within(200, this.friend), dance => {
				this.dance = dance
			}),
			this.sine = new Sine(1.5, 0.05),

		])

		const otherAlly = G.allies.anyUnless(a => a == this && a.friend)

		if (otherAlly) {
			this.friend = otherAlly
			otherAlly.friend = this

			this.pathFinder.target = this.friend
			otherAlly.pathFinder.target = this
		}

		G.allies.add(this)
	}

	update() {
		this.localObjects.update()

		if (!this.stun) {
			if (this.turret) {
				ForcePush(this).towards(this.turret, 3)
			}
			else if (!this.dance) {
				ForcePush(this).towards(this.pathFinder.position, 3)
			}
		}

		const a = this.touchesAny(G.allies)
		if (a) {
			ForcePush(this).awayFrom(a, 3)
			ForcePush(a).awayFrom(this, 3)
			this.stun = true
			this.localObjects.add(new After(800, () => {
				console.log("hey")
				this.stun = false
			}))
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (this.dance) {
			this.position.scale(MinCap(0.5, this.sine.value))
			// draw.text(this.position, "😇")
		}
	}

}
