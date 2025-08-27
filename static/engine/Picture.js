export class Picture extends StaticGameObject {
	constructor(position, image) {
		super(position)

	}

	draw() {
		if (typeof this.image === 'string') {
		}
		else {

			const newWidth = this.position.width
			const newHeight = this.position.height

			Draw.ctx.imageSmoothingEnabled = false

			Draw.ctx.save()
			Draw.ctx.translate(this.position.x + this.position.width, this.position.y + this.position.height)
			Draw.ctx.drawImage(this.image, -newWidth, -newHeight, newWidth, newHeight)
			Draw.ctx.restore()

		}
	}

	mapToJson() {
		return {
			objectId: this.objectId,
			position: this.position.toJson(),
			imagePath: this.imagePath,
		}
	}

}
