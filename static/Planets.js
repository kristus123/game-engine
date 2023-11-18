const planetImage = new Image()
planetImage.src = 'https://w7.pngwing.com/pngs/163/518/png-transparent-red-and-blue-planet-lava-planet-planet-miscellaneous-purple-texture.png'

export class Planets {

	update() {
		
	}

	draw(ctx) {
		planetImage.onload = () => {
		const position = {
			x: 200,
			y: 10,
		}

		const aspectRatio = planetImage.width / planetImage.height

		const maxWidth = 1000
		const maxHeight = 1000

		let newWidth = maxWidth
		let newHeight = maxHeight

		if (planetImage.width > maxWidth) {
			newWidth = maxWidth
			newHeight = newWidth / aspectRatio
		}

		if (newHeight > maxHeight) {
			newHeight = maxHeight
			newWidth = newHeight * aspectRatio
		}

		ctx.save()

		ctx.translate(position.x, position.y)

		ctx.drawImage(
			planetImage,
			-newWidth / 2,
			-newHeight / 2,
			newWidth,
			newHeight,
		)

		ctx.restore()
			
		}
	}
	
}
