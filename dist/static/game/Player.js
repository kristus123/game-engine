import { G } from '/static/engine/G.js'; 
import { PingPong } from '/static/engine/animation/PingPong.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { OnChange } from '/static/engine/on/OnChange.js'; 

export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 400)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.localObjects = new LocalObjects([
			this.sprite = G.Sprite.p2(this.position, 1),
			new OnChange(() => this.movingUp, up => {
				if (up) {
					this.sprite.up.loop()
				}
				else {
					this.sprite.idle.loop()
				}
			}),

			new OnChange(() => this.direction, d => {
				this.sprite.tags[d].loop()
			}),

			new PingPong(v => {
				console.log(v)
				this.position.resize(v)
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
