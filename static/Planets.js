function newImage(src) {
	const image = new Image()
	image.src = src

	return image
}

const images = [
	{
		image: newImage('https://www.nicepng.com/png/full/6-69021_mars-planet-png-mercury-planet-cartoon-png.png'), 
		position: {x:-1000, y:0}
	},
	{
		image: newImage('https://www.nicepng.com/png/full/3-34490_galaxy-planet-planets-space-stars-moon-clouds-paint.png'),
		position: {x:1000, y:0}
	},
	{
		image: newImage('https://www.nicepng.com/png/full/918-9188399_sky-stars-glitch-moon-space-planet-cloud-clouds.png'),
		position: {x:2000, y:0}
	},
]

export class Planets {

	update() {
		
	}

	draw(ctx) {
		for (const i of images) {
			this.drawImage(ctx, i.image, i.position)
		}
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
