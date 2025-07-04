import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { SimplePathFinder } from '/static/engine/mechanics/SimplePathFinder.js'; 
import { PathFinder } from '/static/engine/mechanics/path_finder/PathFinder.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Velocity } from '/static/engine/objects/Velocity.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 
import { Update } from '/static/game/world/Update.js'; 

export class BlobMonster extends DynamicGameObject {
	constructor(player, invisibleWalls) {
		super(new Position(800, 0, 300, 200), 10, 10)

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(invisibleWalls, "argument invisibleWalls in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 
		this.invisibleWalls = invisibleWalls; 


		const pathFinder = new SimplePathFinder(this, player, invisibleWalls)

		this.localObjects = new LocalObjects([
			pathFinder,
			new HorizontalSprite(this.position, '/static/assets/blob_57x32.png'),

			Update(u => {

				if (pathFinder.success) {
					ForcePush(this).towards(pathFinder.c2, 29)
				}
				else {
					ForcePush(this).towards(pathFinder.c1, 29)
				}

				if (this.within(100, pathFinder.c2) || this.within(100, pathFinder.c1)) {
					this.decreaseVelocity(0.8)
				}

				this.velocity.cap = 100

			}),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
