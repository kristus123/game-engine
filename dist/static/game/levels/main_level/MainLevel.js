import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Distance } from '/static/engine/code_tools/misc/Distance.js'; 
import { Level } from '/static/engine/core/Level.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { DeliverPissLevel } from '/static/game/levels/deliver_piss_level/DeliverPissLevel.js'; 
import { AiChat } from '/static/game/levels/main_level/AiChat.js'; 
import { FirstChat } from '/static/game/levels/main_level/FirstChat.js'; 
import { Piss } from '/static/game/levels/main_level/Piss.js'; 
import { PissQuest } from '/static/game/levels/main_level/PissQuest.js'; 
import { D } from '/static/game/world/D.js'; 

export class MainLevel {
	constructor(level, allObjects, world, camera) {

				AssertNotNull(level, "argument level in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(allObjects, "argument allObjects in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(world, "argument world in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(camera, "argument camera in " + this.constructor.name + ".js should not be null")
			
		this.level = level; 
		this.allObjects = allObjects; 
		this.world = world; 
		this.camera = camera; 


		// const pissQuest = new PissQuest(this.world.deliveryDrone, mouse)
		// pissQuest.onFinish = () => {
		// 	level.change(new DeliverPissLevel(world, this.world.npc, level))
		// }

		// this.localObjects = new LocalObjects([
		// this.world,
		// pissQuest,
		// ])
		// allObjects.add(world)

		// ObjectPersistence.get().forEach(o => {
		// 	this.localObjects.add(o)
		// 	o.onCollision = x => {
		// 		Push(o).awayFrom(x)
		// 	}
		// })

		// const chat = this.localObjects.add(new FirstChat(world.npc.position, mouse))
		// chat.onFinish = () => {
		// 	setTimeout(() => {
		// 		this.localObjects.add(new AiChat(this.world.deliveryDrone.position, mouse))
		// 		this.localObjects.remove(chat)
		// 	}, 10_000)
		// }
	}

	update() {
		// console.log(Distance.between(this.world.player, this.world.deliveryDrone))
		// this.localObjects.update()
	}

	draw(draw, guiDraw) {
		// this.localObjects.draw(draw, guiDraw)
	}
}
