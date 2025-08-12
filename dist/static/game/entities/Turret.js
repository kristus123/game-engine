import { G } from '/static/engine/G.js'; 
import { Loop } from '/static/engine/Loop.js'; 
import { a } from '/static/engine/a.js'; 
import { Sine } from '/static/engine/animation/Sine.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Audio } from '/static/engine/audio/Audio.js'; 
import { TestAudio } from '/static/engine/audio/TestAudio.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { Charge } from '/static/engine/mechanics/Charge.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 

export class Turret extends DynamicGameObject {
	constructor(position) {
		super(position, 1, 1)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 100
		this.position.height = 100

		this.a = new TestAudio(G.Audio.sheet)

		this.localObjects = new LocalObjects([
			this.charge = new Charge(1, 10),
			this.sine = new Sine(5, 0.1),
		])
	}

	update() {
		this.position.resize(this.sine.value)
		this.localObjects.update()


		const m = this.withinAny(800, G.monsters)
		if (m && this.charge.ready) {
			this.charge.exhaust()

			const s = new Square(this.position.copy(), 10)
			this.a.play(3)
			ForcePush(s).towards(m.position.center, 400)
			s.update = () => {
				if (s.touchesAny(G.monsters)) {
					console.log('hit')
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
		draw.radius(this.position.center, 800)
		draw.circle(this.position.center)
	}
}
