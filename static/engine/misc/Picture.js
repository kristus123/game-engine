export class Picture {
	constructor(dynamicGameObject, src) {
		this.dynamicGameObject = dynamicGameObject

		this.image = new Image()
		this.image.src = src
		this.image.addEventListener("error",()=>{
			this.imageFailed = true
			console.warn("error got "+src);
		})
		this.image.addEventListener("load",()=>{
			this.imageFailed = false;
			console.warn("loaded")
		})
	}
	
	r(draw, rotation=2) {
		const newWidth = this.dynamicGameObject.width
		const newHeight = this.dynamicGameObject.height

		draw.ctx.save()

		draw.ctx.translate(this.dynamicGameObject.position.center.x, this.dynamicGameObject.position.center.y)
		const rotationAngle = Math.atan2(this.dynamicGameObject.velocity.y, this.dynamicGameObject.velocity.x)
		draw.ctx.rotate(rotationAngle)
		draw.ctx.rotate(Math.PI / rotation) // 90 degrees

		draw.ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)

		draw.ctx.restore()
	}

	draw(draw, guiDraw) { // todo
		if(this.spriteSheetFailed){
			draw.rectangle(this.image, -newWidth, -newHeight, newWidth, newHeight)
			return;
		   }
		if (this.image.complete) {
			const newWidth = this.dynamicGameObject.width
			const newHeight = this.dynamicGameObject.height

			draw.ctx.imageSmoothingEnabled = false

			draw.ctx.save()
			draw.ctx.translate(this.dynamicGameObject.x + this.dynamicGameObject.width, this.dynamicGameObject.y + this.dynamicGameObject.height)
			draw.ctx.drawImage(this.image, -newWidth, -newHeight, newWidth, newHeight)
			draw.ctx.restore()
		}
	}

	old_draw(draw, size) {
		const aspectRatio = this.image.width / this.image.height

		let newWidth = size
		let newHeight = size

		if (this.image.width > size) {
			newWidth = size
			newHeight = newWidth / aspectRatio
		}

		if (newHeight > size) {
			newHeight = size
			newWidth = newHeight * aspectRatio
		}

		draw.ctx.save()
		draw.ctx.translate(this.dynamicGameObject.x, this.dynamicGameObject.y)
		draw.ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)
		draw.ctx.restore()
	}
}

