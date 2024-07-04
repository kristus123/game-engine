export class Killed {
	constructor(c) {
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

