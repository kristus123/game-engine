export class BodyPart extends DynamicGameObject {
	constructor(position, imagePath, part) {
		super(position, 20, 20)
		this.width = 64
		this.height = 64

		this.s = new SpinningSpriteFrame(this, imagePath, part)

		ForcePush(this).towards(Random.direction(position), Random.integerBetween(12*2, 24*2))
	}

	draw(draw, guiDraw) {
		this.s.draw(draw, guiDraw)
	}

}

