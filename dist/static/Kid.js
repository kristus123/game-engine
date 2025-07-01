import { FindChickenQuest } from '/static/FindChickenQuest.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { D } from '/static/game/world/D.js'; 

export class Kid extends DynamicGameObject {
	constructor(position, player) {
		super(position, 10, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.player = player; 

		this.position.width = 170
		this.position.height = 300

		this.localObjects = new LocalObjects([
			new Picture(this.position, '/static/assets/kid.png'),
			new FindChickenQuest(this, player),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
