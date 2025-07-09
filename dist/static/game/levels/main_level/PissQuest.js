import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Once } from '/static/engine/code_tools/Once.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { RunOnce } from '/static/engine/code_tools/on/RunOnce.js'; 
import { Call } from '/static/engine/code_tools/tools/Call.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Piss } from '/static/game/levels/main_level/Piss.js'; 

export class PissQuest {
	constructor(deliveryDrone) {

				AssertNotNull(deliveryDrone, "argument deliveryDrone in " + this.constructor.name + ".js should not be null")
			
		this.deliveryDrone = deliveryDrone; 

		this.cleanedPisses = 0

		deliveryDrone.compass.clear()

		this.localObjects = new LocalObjects(Random.positions(0, 200, -200, 3000, 20).map(position => {
			position.width = 200
			position.height = 200

			deliveryDrone.compass.add(position, 'yellow')

			const piss = new Piss(deliveryDrone, position)
			piss.onFinish = () => {
				this.cleanedPisses += 1
				deliveryDrone.compass.remove(position, 'yellow')
			}

			return piss
		}))
	}

	update() {
		RunOnce(this.cleanedPisses == 20, () => {
			Call(this.onFinish)
		})

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
