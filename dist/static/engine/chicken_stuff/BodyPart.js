import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { SpinningSpriteFrame } from '/static/engine/graphics/SpinningSpriteFrame.js'; 
import { SpriteFrame } from '/static/engine/mechanics/SpriteFrame.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { D } from '/static/game/world/D.js'; 

export class BodyPart extends DynamicGameObject {
	constructor(position, imagePath, part) {
		super(position, 20, 20)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(imagePath, "argument imagePath in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(part, "argument part in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.imagePath = imagePath; 
		this.part = part; 

		this.width = 64
		this.height = 64

		this.s = new SpinningSpriteFrame(this, imagePath, part)

		ForcePush(this).towards(Random.direction(position), Random.integerBetween(12*2, 24*2))
	}

	draw(draw, guiDraw) {
		this.s.draw(draw, guiDraw)
	}

}

