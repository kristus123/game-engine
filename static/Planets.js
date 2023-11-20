const playerImage = new Image()
playerImage.src = 'https://www.nicepng.com/png/full/6-69021_mars-planet-png-mercury-planet-cartoon-png.png'


const spaceImage = new Image()
spaceImage.src = 'https://www.nicepng.com/png/full/3-34490_galaxy-planet-planets-space-stars-moon-clouds-paint.png'

export class Planets {

	update() {
		
	}

	draw(ctx) {
		this.loadImage(ctx, playerImage, {x:1, y:1})
		this.loadImage(ctx, spaceImage, {x:-1000, y:1})
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
