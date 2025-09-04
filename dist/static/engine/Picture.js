import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 

export class Picture extends StaticGameObject {
	constructor(position, image) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(image, "argument image in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.image = image; 


	}

	draw(draw) {
		if (typeof this.image === 'string') {
		}
		else {

			const newWidth = this.position.width
			const newHeight = this.position.height

			draw.ctx.imageSmoothingEnabled = false

			draw.ctx.save()
			draw.ctx.translate(this.position.x + this.position.width, this.position.y + this.position.height)
			draw.ctx.drawImage(this.image, -newWidth, -newHeight, newWidth, newHeight)
			draw.ctx.restore()

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
