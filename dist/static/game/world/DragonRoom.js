import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Dialogue } from '/static/engine/mechanics/dialogue/Dialogue.js'; 
import { MultiTextTyper } from '/static/engine/mechanics/dialogue/MultiTextTyper.js'; 
import { TextTyper } from '/static/engine/mechanics/dialogue/TextTyper.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 
import { Npc } from '/static/game/world/Npc.js'; 

export class DragonRoom {
	constructor(player) {

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 


		this.entrance = new DynamicGameObject(new Position(200, 2037, 100, 100), 1, 1)

		const oldMan = new Npc(new Position(1177, 1247, 140, 200))
		Camera.zoom = 1.5
		Camera.follow(oldMan)

		this.localObjects = new LocalObjects([
			new Picture(new Position(0, 0, 100*20, 100*20), '/static/assets/dragon_room.png'),
			this.entrance,
			oldMan,

			new Dialogue([
				new MultiTextTyper(oldMan.position.over(), [
					'hei'
				], () => {
					Camera.follow(player)
				}),
				new MultiTextTyper(player.position.over(), [
					'hei'
				])
			]),

			D((draw, guiDraw) => {
				const sword = new Position(936, 1174)
				if (player.within(200, sword)) {
					console.log('hei')
					draw.text(sword.offset(0, -100), 'E to pick up')
				}
			}),
		])
	}

	update() {
		this.localObjects.update()

		if (this.player.within(500, this.entrance)) {
			Camera.follow(this.entrance)
		}
		else {
			// Camera.follow(this.player)
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
