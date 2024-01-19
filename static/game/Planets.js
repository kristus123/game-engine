const planet = new Picture(new GameObject(-1800, 0, 100, 100, 10, 10), 'https://www.nicepng.com/png/full/6-69021_mars-planet-png-mercury-planet-cartoon-png.png')

export class Planets {

	update() {

	}

	draw(draw) {
		planet.gameObject.width *= 1.01
		planet.gameObject.height *= 1.01
		planet.draw(draw)
	}

	drawImage(ctx, image, position) {
		const aspectRatio = image.width / image.height

		const maxWidth = 800
		const maxHeight = 800

		let newWidth = maxWidth
		let newHeight = maxHeight

		if (image.width > maxWidth) {
			newWidth = maxWidth
			newHeight = newWidth / aspectRatio
		}

		if (newHeight > maxHeight) {
			newHeight = maxHeight
			newWidth = newHeight * aspectRatio
		}

		ctx.save()
		ctx.translate(position.x, position.y)
		ctx.drawImage(image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)
		ctx.restore()
	}

}
