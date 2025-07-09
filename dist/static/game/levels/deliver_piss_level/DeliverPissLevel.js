import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Chat } from '/static/game/legacy/Chat.js'; 
import { SecondChat } from '/static/game/levels/deliver_piss_level/SecondChat.js'; 

export class DeliverPissLevel {
	constructor(world, npc, level) {

				AssertNotNull(world, "argument world in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(npc, "argument npc in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(level, "argument level in " + this.constructor.name + ".js should not be null")
			
		this.world = world; 
		this.npc = npc; 
		this.level = level; 


		this.factory = new Factory(world.player)
		this.factory.onFinish = () => {
			console.log('GOOD JOB BOI!')
		}

		this.localObjects = new LocalObjects([
			world,
			npc,
			new SecondChat(npc.position),
			this.factory
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
