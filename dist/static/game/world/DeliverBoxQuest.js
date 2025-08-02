import { G } from '/static/engine/G.js'; 
import { ListLooper } from '/static/engine/code_tools/ListLooper.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Move } from '/static/engine/core/physics/Move.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { Html } from '/static/engine/graphics/ui/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Registry } from '/static/engine/objects/Registry.js'; 

export class DeliverBoxQuest {
	constructor() {


		this.localObjects = new LocalObjects([
			new ListLooper(Registry.ChickenBox, (box, next, finished) => {
				if (!G.storeWorker.touches(box)) {
					Move(G.storeWorker).towards(box)
				}
				else if (G.player.pickUpBox.holding) {
					Move(G.storeWorker).towards(G.player)
				}
				else if (!box.touches(G.store)) {
					Move(G.storeWorker).towards(G.store)
					box.position.xy(G.storeWorker)
				}

				if (G.storeWorker.touches(G.player)) {
					ForcePush(G.player).awayFrom(G.store, 7)
					Controller.disable(200)
					G.player.pickUpBox.drop()
				}

				if (box.touches(G.store)) {
					Html.fadeaway('box delivered', G.storeWorker)
					next()
				}
			})
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
