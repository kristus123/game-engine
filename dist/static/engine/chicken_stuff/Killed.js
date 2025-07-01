import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { BodyPart } from '/static/engine/chicken_stuff/BodyPart.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 

export class Killed {
	constructor(c) {

				AssertNotNull(c, "argument c in " + this.constructor.name + ".js should not be null")
			
		this.c = c; 

		const chickenSprite = '/static/assets/sprites/dead_chicken_32x32.png'

		this.splatteredBody = [
			new BodyPart(Random.direction(c, 10), chickenSprite, { x: 1, y: 0 }),
			new BodyPart(Random.direction(c, 10), chickenSprite, { x: 2, y: 0 }),
			new BodyPart(Random.direction(c, 10), chickenSprite, { x: 2, y: 1 }),
			new BodyPart(Random.direction(c, 10), chickenSprite, { x: 1, y: 1 }),
			new BodyPart(Random.direction(c, 10), chickenSprite, { x: 1, y: 1 }),
		]
	}

	draw(draw, guiDraw) {
		for (const b of this.splatteredBody) {
			b.draw(draw, guiDraw)
		}
	}
}

