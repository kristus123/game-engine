const spaceship = new Image()
spaceship.src =
	'https://www.nicepng.com/png/full/13-138961_vector-spaces-ship-8-bit-spaceship-sprite.png'

const playerImage = new Image()
playerImage.src =
	'https://www.nicepng.com/png/full/343-3434119_overworld-pokemon-trainer-fusion-with-hydreigon-pokemon-red.png'

export class Draw {

	static new_rectangle(ctx, position) {
		ctx.fillStyle = 'orange'
		ctx.fillRect(position.x, position.y, position.width, position.height)

		ctx.strokeStyle = 'white'
		ctx.lineWidth = 4
		ctx.strokeRect(position.x, position.y, position.width, position.height)

		ctx.fillStyle = 'white'
		ctx.font = '25px Arial'
	}

	static rectangle(ctx, x, y, width, height) {
		ctx.fillStyle = 'orange'
		ctx.fillRect(x, y, width, height)

		ctx.strokeStyle = 'white'
		ctx.lineWidth = 4
		ctx.strokeRect(x, y, width, height)
	}

	static blueRectangle(ctx, x, y) {
		ctx.fillStyle = 'blue'
		ctx.fillRect(x, y, 10, 10)
	}

	static splash(ctx, spawnPosition, minAngle, maxAngle, length = 500) {
		ctx.beginPath()

		// Calculate endpoint for the furthest left angle
		const leftX = spawnPosition.x + length * Math.cos(minAngle)
		const leftY = spawnPosition.y + length * Math.sin(minAngle)

		// Calculate endpoint for the furthest right angle
		const rightX = spawnPosition.x + length * Math.cos(maxAngle)
		const rightY = spawnPosition.y + length * Math.sin(maxAngle)

		// Draw lines
		ctx.moveTo(spawnPosition.x, spawnPosition.y)
		ctx.lineTo(leftX, leftY)
		ctx.moveTo(spawnPosition.x, spawnPosition.y)
		ctx.lineTo(rightX, rightY)

		// Set line style
		ctx.lineWidth = 2
		ctx.strokeStyle = 'red' // You can set your desired color

		// Stroke the lines
		ctx.stroke()
		ctx.closePath()
	}

	static hpBar(ctx, position, currentHp, maxHp) {
		function toPercentage() { // returns a value between 0.0 and 1.0 representing percentage
			const numerator = currentHp
			const denominator = maxHp

			const percentage = (numerator / denominator) * 100

			const displayValue = percentage / 100

			return displayValue
		}

		const width = 200
		const height = 20

		let currentHP = 1
		currentHP = toPercentage()

		currentHP = Math.max(0, currentHP - 0.01)

		ctx.fillStyle = 'white'
		ctx.fillRect(position.x, position.y, width, height)

		ctx.fillStyle = 'red'
		ctx.fillRect(position.x, position.y, currentHP * width, height)
	}

	static circle(ctx, x, y, radius, color) {
		ctx.beginPath()
		ctx.arc(x, y, radius, 0, Math.PI * 2, false)
		ctx.fillStyle = color
		ctx.fill()
	}

	static new_circle(ctx, position) {
		const radius = 10
		const color = 'red'

		ctx.beginPath()
		ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, false)
		ctx.fillStyle = color
		ctx.fill()
	}

	static position(ctx, position) {
		const radius = 5
		ctx.beginPath()
		ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, false)
		ctx.fillStyle = 'orange'
		ctx.fill()
	}

	static hollowCircle(ctx, position, color, radius) {
		ctx.strokeStyle = color
		ctx.lineWidth = 20

		ctx.beginPath()
		ctx.arc(position.x, position.y, radius, 0, Math.PI * 2)
		ctx.stroke()
	}


	static angle = 0

	// todo must be updated somehow iwthin game lloop
	static circleSpinning(ctx, objectToFollow, radius) {
		const x =
			objectToFollow.x +
			objectToFollow.width / 2 +
			radius * Math.cos(Draw.angle)
		const y =
			objectToFollow.y +
			objectToFollow.height / 2 +
			radius * Math.sin(Draw.angle)

		Draw.circle(ctx, x, y, 10, 'red')

		Draw.angle += 0.1

		return {
			x,
			y,
		}
	}

	// needs some work obviously, but it works
	static revertMouse(ctx, player, mousePosition) {
		function getAngle(x1, y1, x2, y2) {
			return Math.atan2(y2 - y1, x2 - x1)
		}

		player.angle = 0
		const playerRadius = 20
		const circleRadius = 50

		const oppositeAngle = player.angle + Math.PI
		const circleX = player.x + player.width / 2 + circleRadius * Math.cos(oppositeAngle)
		const circleY = player.y + player.height / 2 + circleRadius * Math.sin(oppositeAngle)

		Draw.circle(ctx, circleX, circleY, playerRadius, 'red')

		player.angle = getAngle(
			player.x + player.width / 2,
			player.y + player.height / 2,
			mousePosition.x,
			mousePosition.y)

		return {
			x: circleX,
			y: circleY,
		}
	}

	static objectThatIsMovingInRectangularPathAroundObject(
		ctx,
		player,
		mousePosition,
	) {
		ctx.lineWidth = 2

		// Calculate distances from player's center to mouse position
		const dx = mousePosition.x - player.position.center.x
		const dy = mousePosition.y - player.position.center.y
		// Calculate the maximum allowed distances for rectangular movement
		const horizontalRectDistance = 800
		const verticalRectDistance = 300

		// Calculate the position for the circle to move in a rectangular path
		let circleX =
			player.position.center.x +
			Math.min(Math.abs(dx), horizontalRectDistance) * Math.sign(dx)
		let circleY =
			player.position.center.y +
			Math.min(Math.abs(dy), verticalRectDistance) * Math.sign(dy)

		// Draw the circle
		const playerRadius = 20
		Draw.circle(ctx, circleX, circleY, playerRadius, 'red')

		// Draw the rectangle
		const rectX = player.position.center.x - horizontalRectDistance
		const rectY = player.position.center.y - verticalRectDistance
		const rectWidth = horizontalRectDistance * 2
		const rectHeight = verticalRectDistance * 2

		ctx.strokeStyle = 'blue'
		ctx.strokeRect(rectX, rectY, rectWidth, rectHeight)

		return {x: circleX, y: circleY}
	}

	// needs some work obviously, but it works
	static objectThatIsCirclingAroundObjectBasedOnMousePosition(
		ctx,
		player,
		mousePosition,
	) {
		function getAngle(x1, y1, x2, y2) {
			return Math.atan2(y2 - y1, x2 - x1)
		}

		const angle = getAngle(
			player.x,
			player.y,
			mousePosition.x,
			mousePosition.y,
		)
		const playerRadius = 20
		const circleRadius = 200

		const circleX =
			player.x + player.width / 2 + circleRadius * Math.cos(angle)
		const circleY =
			player.y + player.height / 2 + circleRadius * Math.sin(angle)

		Draw.circle(ctx, circleX, circleY, playerRadius, 'red')
	}

	static lineBetween(ctx, start, end) {
		ctx.beginPath()
		ctx.moveTo(start.x, start.y)
		ctx.lineTo(end.x, end.y)
		ctx.strokeStyle = 'white'
		ctx.lineWidth = 5
		ctx.stroke()
	}

	static text(ctx, x, y, width, height, text) {
		Draw.rectangle(ctx, x, y, width, height)

		ctx.fillStyle = 'white'
		ctx.font = '25px Arial'
		ctx.fillText(text, x + 20, y + height / 2)
	}

	static new_text(ctx, position, text) {
		Draw.rectangle(ctx, position.x, position.y, position.width, 100)

		ctx.fillStyle = 'white'
		ctx.font = '25px Arial'
		ctx.fillText(text, position.x + 20, position.y + 50)
	}

	
	static coordinates(ctx, o) {
		Draw.rectangle(ctx, o.x, o.y, o.width, o.height)

		ctx.fillStyle = 'white'
		ctx.font = '25px Arial'
		ctx.fillText(`${Math.floor(o.x)} - ${Math.floor(o.y)}`, o.x + 20, o.y + o.height / 2)
	}

	static spaceship(ctx, player) {
		const aspectRatio = spaceship.width / spaceship.height

		const maxWidth = 500
		const maxHeight = 200

		let newWidth = maxWidth
		let newHeight = maxHeight

		if (spaceship.width > maxWidth) {
			newWidth = maxWidth
			newHeight = newWidth / aspectRatio
		}

		if (newHeight > maxHeight) {
			newHeight = maxHeight
			newWidth = newHeight * aspectRatio
		}

		ctx.save()

		ctx.translate(player.x, player.y)
		const rotationAngle = Math.atan2(player.velocity.y, player.velocity.x)
		ctx.rotate(rotationAngle)
		ctx.rotate(Math.PI / 2) // 90 degrees

		ctx.drawImage(
			spaceship,
			-newWidth / 2,
			-newHeight / 2,
			newWidth,
			newHeight,
		)

		ctx.restore()
	}

	static player(ctx, player) {
		const aspectRatio = playerImage.width / playerImage.height

		const maxWidth = 50
		const maxHeight = 200

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

		ctx.translate(player.x + player.width / 2, player.y + player.height / 2)

		ctx.drawImage(
			playerImage,
			-newWidth / 2,
			-newHeight / 2,
			newWidth,
			newHeight,
		)

		ctx.restore()
	}

	static grid(ctx) {
		ctx.strokeStyle = '#ccc' // Grid color
		ctx.lineWidth = 2

		const cellSize = 100 // Adjust this to change the grid cell size
		const mapWidth = 1000 // Adjust this to match your map's width
		const mapHeight = 1000 // Adjust this to match your map's height
		const rows = Math.floor(mapHeight / cellSize)
		const columns = Math.floor(mapWidth / cellSize)

		for (let i = 0; i < rows; i++) {
			ctx.beginPath()
			ctx.moveTo(0, i * cellSize)
			ctx.lineTo(mapWidth, i * cellSize)
			ctx.stroke()
		}

		ctx.beginPath()
		ctx.moveTo(0, mapHeight)
		ctx.lineTo(mapWidth, mapHeight)
		ctx.stroke()

		for (let j = 0; j < columns; j++) {
			ctx.beginPath()
			ctx.moveTo(j * cellSize, 0)
			ctx.lineTo(j * cellSize, mapHeight)
			ctx.stroke()
		}

		ctx.beginPath()
		ctx.moveTo(mapWidth, 0)
		ctx.lineTo(mapWidth, mapHeight)
		ctx.stroke()
	}

	static sprite() {
		const spriteSheet = new Image()

		spriteSheet.src = 'https://opengameart.org/sites/default/files/exp2.png'
		const frameWidth = 64 // Width of each frame in the sprite sheet
		const frameHeight = 64 // Height of each frame in the sprite sheet
		const scale = 5 // Scale factor


		const frameSequence = [
			{ x: 0, y: 0 }, // Frame 2
			{ x: 0, y: 1 }, // Frame 2
			{ x: 0, y: 2 }, // Frame 2
			{ x: 0, y: 3 }, // Frame 2
		]

		let currentFrameIndex = 0 // Index of the current frame in frameSequence
		const totalFrames = frameSequence.length

		setInterval(() => {
			currentFrameIndex = (currentFrameIndex + 1) % totalFrames
		}, 200)

		const x = -300
		const y = 0

		return function drawFrame(ctx) {
			const frameInfo = frameSequence[currentFrameIndex]
			const currentFrameX = frameInfo.x
			const currentFrameY = frameInfo.y

			ctx.imageSmoothingEnabled = false
			ctx.drawImage(
				spriteSheet,
				currentFrameX * frameWidth,
				currentFrameY * frameHeight,
				frameWidth,
				frameHeight,
				x,
				y,
				frameWidth * scale,
				frameHeight * scale,
			)
		}
	}

	// this is not in use
	static fill(ctx, color) {
		ctx.fillStyle = color
		ctx.fillRect(0, 0, Palette.width, Palette.height)
	}

	// static crate(ctx, position) {
	// 	Draw.crateImage.draw(ctx, position)
	// }
}
