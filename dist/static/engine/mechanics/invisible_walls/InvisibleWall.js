import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 
import { Collision } from '/static/engine/physics/Collision.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class InvisibleWall extends StaticGameObject {
	constructor(position) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		if (this.position.width == 1) {
			this.position.width = 100
			this.position.height = 100
		}
	}

	update() {
		for (const o of [
			G.player,
		]) {
			if (Collision.between(this, o)) {
				const currentPosition = { x: o.position.x, y: o.position.y }

				o.position.x = o.previousPosition.x
				if (!Collision.between(this, o)) {

					o.velocity.x = 0
					o.position.x = o.previousPosition.x
					return
				}
				else {
					o.position.x = currentPosition.x
				}

				o.position.y = o.previousPosition.y
				if (!Collision.between(this, o)) {

					o.velocity.y = 0
					o.position.y = o.previousPosition.y
					return
				}
				else {
					o.position.y = currentPosition.y
				}
			}
		}
	}

	draw(draw, guiDraw) {
		draw.transparentRedRectangle(this.position)
	}

	static mapFromJsonObject(json) {
		const o = new this(Position.from(json.position))

		o.objectId = json.objectId

		return o
	}

	mapToJson() {
		return {
			objectId: this.objectId,
			position: this.position.toJson(),
		}
	}

}
