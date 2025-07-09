import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 

export class Barn extends StaticGameObject {
	constructor(position) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 20
		this.position.height = 20

		this.localObjects = new LocalObjects()

		this.sleepyTime = true

		setInterval(() => {
			this.sleepyTime = !this.sleepyTime

			for (const m of G.monsters) {
				m.sleepyTime = this.sleepyTime
			}
		}, 5_000)
	}

	update() {
		this.localObjects.update()
		// console.log(this.sleepyTime)
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		// console.log(Mouse.position.x)

		super.draw(draw, guiDraw)
	}
}
