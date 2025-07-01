import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 

export class HorizontalSprite extends StaticGameObject {
	constructor(position, imagePath, speed=100) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(imagePath, "argument imagePath in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(speed, "argument speed in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.imagePath = imagePath; 
		this.speed = speed; 

		const sprite = new Sprite(this.position, imagePath, [
			{ x: 0, y: 0 },
		], speed)

		const x = setInterval(() => {
			if (sprite.image.complete) {
				const frameSequence = []
				for (let i = 0; i < sprite.image.width / sprite.width; i++) {
					console.log(i)
					frameSequence.push({ x: i, y: 0 })
				}
				sprite.frameSequence = frameSequence

				clearInterval(x)
			}
		}, 10)


		this.localObjects = new LocalObjects([sprite])
	}

	update() {



		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
