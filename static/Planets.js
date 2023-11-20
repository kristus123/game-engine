const images = [
	{
		src: "https://www.nicepng.com/png/full/6-69021_mars-planet-png-mercury-planet-cartoon-png.png", 
		position: {x:0, y:0}
	},
	{
		src: "https://www.nicepng.com/png/full/3-34490_galaxy-planet-planets-space-stars-moon-clouds-paint.png",
		position: {x:1000, y:0}
	},
	{
		src: "https://www.nicepng.com/png/full/918-9188399_sky-stars-glitch-moon-space-planet-cloud-clouds.png",
		position: {x:2000, y:0}
	},
]


export class Planets {

	update() {
		
	}

	draw(ctx) {
		for (const i of images) {
			const image = new Image()
			image.src = i.src

			this.loadImage(ctx, image, i.position)
		}
	}


	loadImage(ctx, playerImage, player) {
		const aspectRatio = playerImage.width / playerImage.height

		const maxWidth = 800
		const maxHeight = 800

		let newWidth = maxWidth
		let newHeight = maxHeight

		if (playerImage.width > maxWidth) {
			newWidth = maxWidth
			newHeight = newWidth / aspectRatio
		}

		if (newHeight > maxHeight) {
			newHeight = maxHeight
			newWidth = newHeight * aspectRatio
		}

		ctx.save()
			ctx.translate(player.x, player.y)
			ctx.drawImage(playerImage, -newWidth / 2, -newHeight / 2, newWidth, newHeight)
		ctx.restore()
	}


	
}
