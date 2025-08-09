import { G } from '/static/engine/G.js'; 
import { Init } from '/static/engine/Init.js'; 
import { Loop } from '/static/engine/Loop.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { Charge } from '/static/engine/mechanics/Charge.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 

export class Turret extends DynamicGameObject {
	constructor(position) {
		super(position, 1,1)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 100
		this.position.height = 100


		this.localObjects = new LocalObjects([
			Init(this, {
				charge: new Charge(5, 10),
			}),
		])
	}
	
	update() {
		this.localObjects.update()


		const m = this.withinAny(800, G.monsters)
		if (m && this.charge.ready) {
			this.charge.exhaust()

			const s = new Square(this.position.copy(), 10)
			ForcePush(s).towards(m, 400)
			s.update = () => {
				if (s.touchesAny(G.monsters)) {
					console.log("hit")
					m.hp.damage(10)
					s.removeFromLoop()
				}
			}

			this.localObjects.add(s)
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)


		draw.rectangle(this.position)
		draw.radius(this.position, 800)
	}
}
