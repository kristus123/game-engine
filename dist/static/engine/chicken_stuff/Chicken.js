import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { ChickenSprites } from '/static/engine/chicken_stuff/ChickenSprites.js'; 
import { DeadChicken } from '/static/engine/chicken_stuff/DeadChicken.js'; 
import { Distance } from '/static/engine/code_tools/misc/Distance.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { OnTrue } from '/static/engine/code_tools/on/OnTrue.js'; 
import { Loop } from '/static/engine/core/Loop.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { Audio } from '/static/engine/mechanics/audio/Audio.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Registry } from '/static/engine/objects/Registry.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 
import { Init } from '/static/game/world/Init.js'; 
import { Update } from '/static/game/world/Update.js'; 

export class Chicken extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 1000)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 60
		this.position.height = 60

		const zone = new Position(0, 0, 100, 100)
		if (!this.touches(zone)) {
			this.x = zone.center.x
			this.y = zone.center.y
		}

		this.randomPositionInsideZone = Random.direction(zone.center, 200)

		this.localObjects = new LocalObjects([
			// Init(this, {
			// 	chickenSprites: new ChickenSprites(this),
			// }),
			Update(() => {
				const nearbyChicken = this.touchesAny(Registry.Chicken)
				if (nearbyChicken) {
					this.enforceDistance(nearbyChicken)
				}
				else {
					ForcePush(this).towards(this.randomPositionInsideZone, 0.1)
				}
			}),
			new OnTrue(() => this.touches(this.randomPositionInsideZone), () => {
				this.randomPositionInsideZone = Random.positionWithin(zone.center)
			}),
			new OnTrue(() => this.touchesAny(Registry.ChickenFood), food => {
				// this.chickenSprites.eat()
				food.removeFromLoop()
			}),
			D((draw, guiDraw) => {
				draw.orange(this.randomPositionInsideZone)
			}),
		])

		setTimeout(() => {
			this.kill()
		}, 1000)
	}

	kill() {
		// Audio.poop()
		// this.handledBy.add(new DeadChicken(this.position))
		// this.removeFromLoop()
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

	static mapFromJsonObject(json) {
		const o = new this(new Position(json.position.x, json.position.y, json.position.width, json.position.height))
		o.objectId = json.objectId

		return o
	}

	mapToJson() {
		return {
			className: this.constructor.name,
			objectId: this.objectId,
			position: {
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height,
			},
		}
	}
}
