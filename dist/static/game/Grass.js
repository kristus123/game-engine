import { G } from '/static/engine/G.js'; 
import { Init } from '/static/engine/Init.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { KeyDown } from '/static/engine/controller/keyboard/KeyDown.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 

export class Grass extends StaticGameObject {
	constructor(position) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.trimmed = false

		this.localObjects = new LocalObjects([
			Init(this, {
				sprite: G.Sprite.grass(this.position).randomStartFrame(),
			}),

		])

		KeyDown('e', () => {
			if (!this.trimmed && this.touches(G.player)) {
				this.sprite.trimmed.loop()
				this.trimmed = G.Sprite.grass(this.position.copy())
				this.trimmed.inventory.loop()
				this.localObjects.add(this.trimmed)
				ForcePush(this.trimmed).awayFrom(G.player)
			}
		})
	}


	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
