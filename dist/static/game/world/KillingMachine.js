import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Chicken } from '/static/engine/chicken_stuff/Chicken.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { ChickenBox } from '/static/game/world/ChickenBox.js'; 
import { Init } from '/static/game/world/Init.js'; 

export class KillingMachine extends StaticGameObject {
	constructor(position) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.localObjects = new LocalObjects([
			Init(this, {
				house: new Picture(new Position(0, -800, 20*16, 20*16), '/static/assets/small_house.png'),
			}),
		])

		G.store = this.house

		const box = new ChickenBox(this.position.copy().set(350))
		this.localObjects.add(box)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
