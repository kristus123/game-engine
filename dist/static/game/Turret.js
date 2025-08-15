import { G } from '/static/engine/G.js'; 
import { Loop } from '/static/engine/Loop.js'; 
import { a } from '/static/engine/a.js'; 
import { Motion } from '/static/engine/animation/Motion.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Audio } from '/static/engine/audio/Audio.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Charge } from '/static/engine/mechanics/Charge.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 
import { TurretNeeds } from '/static/game/TurretNeeds.js'; 

export class Turret extends DynamicGameObject {
	constructor(position) {
		super(position, 1, 1)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 100
		this.position.height = 100

		this.a = new Audio(G.Audio.sheet)

		this.localObjects = new LocalObjects([
			this.charge = new Charge(1, 10),
			this.turretNeeds =  new TurretNeeds(this),
			G.Sprite.turret(this.position),
			this.motion = new Motion(),
		])
		this.motion.start()
	}

	get target() {
		return this.withinAny(800, G.monsters)
	}

	update() {
		this.position.scale(this.motion.value)
		this.localObjects.update()

		if (this.charge.ready && this.target && !this.turretNeeds.needsSomething) {
			this.charge.exhaust()

			const b = new Square(this.position.copy(), 10)
			this.a.play(1)

			ForcePush(b).towards(this.target.position.center, 400)

			b.update = () => {
				if (b.touchesAny(G.monsters)) {
					this?.target?.hp?.damage(10) // temporarry hack
					b.removeFromLoop()
				}
			}

			this.localObjects.add(b)
		}
	}

	draw(draw, guiDraw) {
		if (this.name) {
			draw.text(this.position, this.name)
			
		}
		this.localObjects.draw(draw, guiDraw)
		if (Mouse.touches(this)) {
			draw.radius(this.position.center, 400)
		}
		// draw.rectangle(this.position)
		// draw.circle(this.position.center)
	}
}
