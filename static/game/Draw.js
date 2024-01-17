
export class Draw {

	static ctx = Palette.main().ctx

	static new_rectangle(position) {

		Draw.ctx.fillStyle = 'yellow'
		Draw.ctx.fillRect(position.x, position.y, position.width, position.height)

		Draw.ctx.strokeStyle = 'yellow'
		Draw.ctx.lineWidth = 4
		Draw.ctx.strokeRect(position.x, position.y, position.width, position.height)

		Draw.ctx.fillStyle = 'white'
		Draw.ctx.font = '25px Arial'
	}

	static rectangle(x, y, width, height, color = 'orange') {
		Draw.ctx.fillStyle = color
		Draw.ctx.fillRect(x, y, width, height)

		Draw.ctx.strokeStyle = 'white'
		Draw.ctx.lineWidth = 4
		Draw.ctx.strokeRect(x, y, width, height)
	}

	static blueRectangle(x, y) {
		Draw.ctx.fillStyle = 'blue'
		Draw.ctx.fillRect(x, y, 10, 10)
	}

	static splash(spawnPosition, targetLocation, angleWidth, length = 500) {
		Draw.ctx.beginPath()

		// Calculate angle towards targetLocation
		const angle = Math.atan2(targetLocation.y - spawnPosition.y, targetLocation.x - spawnPosition.x)

		// Calculate endpoints based on the angle width
		const leftAngle = angle - angleWidth / 2
		const rightAngle = angle + angleWidth / 2

		const leftX = spawnPosition.x + length * Math.cos(leftAngle)
		const leftY = spawnPosition.y + length * Math.sin(leftAngle)

		const rightX = spawnPosition.x + length * Math.cos(rightAngle)
		const rightY = spawnPosition.y + length * Math.sin(rightAngle)

		// Draw lines
		Draw.ctx.moveTo(spawnPosition.x, spawnPosition.y)
		Draw.ctx.lineTo(leftX, leftY)

		Draw.ctx.moveTo(spawnPosition.x, spawnPosition.y)
		Draw.ctx.lineTo(rightX, rightY)

		// Set line style
		Draw.ctx.lineWidth = 2
		Draw.ctx.strokeStyle = 'red' // You can set your desired color

		// Stroke the lines
		Draw.ctx.stroke()
		Draw.ctx.closePath()
	}

	static hpBar(position, currentHp, maxHp) {
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

		Draw.ctx.fillStyle = 'white'
		Draw.ctx.fillRect(position.x, position.y, width, height)

		Draw.ctx.fillStyle = 'red'
		Draw.ctx.fillRect(position.x, position.y, currentHP * width, height)
	}

	static circle(x, y, radius, color) {
		Draw.ctx.beginPath()
		Draw.ctx.arc(x, y, radius, 0, Math.PI * 2, false)
		Draw.ctx.fillStyle = color
		Draw.ctx.fill()
	}

	static new_circle(position, radius = 10) {
		const color = 'red'

		Draw.ctx.beginPath()
		Draw.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, false)
		Draw.ctx.fillStyle = color
		Draw.ctx.fill()
	}

	static position(position) {
		const radius = 5
		Draw.ctx.beginPath()
		Draw.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, false)
		Draw.ctx.fillStyle = 'orange'
		Draw.ctx.fill()
	}

	static hollowCircle(position, color, radius) {
		Draw.ctx.strokeStyle = color
		Draw.ctx.lineWidth = 6

		Draw.ctx.beginPath()
		Draw.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2)
		Draw.ctx.stroke()
	}


	static angle = 0

	// todo must be updated somehow iwthin game lloop
	static circleSpinning(objectToFollow, radius) {
		const x =
			objectToFollow.x +
			objectToFollow.width / 2 +
			radius * Math.cos(Draw.angle)
		const y =
			objectToFollow.y +
			objectToFollow.height / 2 +
			radius * Math.sin(Draw.angle)

		Draw.circle(Draw.ctx, x, y, 10, 'red')

		Draw.angle += 0.1

		return {
			x,
			y,
		}
	}

	// needs some work obviously, but it works
	static revertMouse(player, mousePosition) {
		function getAngle(x1, y1, x2, y2) {
			return Math.atan2(y2 - y1, x2 - x1)
		}

		player.angle = 0
		const playerRadius = 20
		const circleRadius = 50

		const oppositeAngle = player.angle + Math.PI
		const circleX = player.x + player.width / 2 + circleRadius * Math.cos(oppositeAngle)
		const circleY = player.y + player.height / 2 + circleRadius * Math.sin(oppositeAngle)

		Draw.circle(Draw.ctx, circleX, circleY, playerRadius, 'red')

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
		player,
		mousePosition,
	) {
		Draw.ctx.lineWidth = 2

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
		Draw.circle(Draw.ctx, circleX, circleY, playerRadius, 'red')

		// Draw the rectangle
		const rectX = player.position.center.x - horizontalRectDistance
		const rectY = player.position.center.y - verticalRectDistance
		const rectWidth = horizontalRectDistance * 2
		const rectHeight = verticalRectDistance * 2

		Draw.ctx.strokeStyle = 'blue'
		Draw.ctx.strokeRect(rectX, rectY, rectWidth, rectHeight)

		return { x: circleX, y: circleY }
	}

	// needs some work obviously, but it works
	static objectThatIsCirclingAroundObjectBasedOnMousePosition(
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

		Draw.circle(Draw.ctx, circleX, circleY, playerRadius, 'red')
	}

	static lineBetween(start, end) {
		Draw.ctx.beginPath()
		Draw.ctx.moveTo(start.x, start.y)
		Draw.ctx.lineTo(end.x, end.y)
		Draw.ctx.strokeStyle = 'white'
		Draw.ctx.lineWidth = 5
		Draw.ctx.stroke()
	}

	static text(x, y, width, height, text) {
		Draw.rectangle(Draw.ctx, x, y, width, height)

		Draw.ctx.fillStyle = 'white'
		Draw.ctx.font = '25px Arial'
		Draw.ctx.fillText(text, x + 20, y + height / 2)
	}

	static new_text(position, text, color = 'orange') {
		Draw.rectangle(Draw.ctx, position.x, position.y, position.width, position.height, color)

		Draw.ctx.fillStyle = 'white'
		Draw.ctx.font = '25px Arial'
		Draw.ctx.fillText(text, position.x + 20, position.y + 50)
	}


	static position(o) {
		Draw.rectangle(Draw.ctx, o.x, o.y, o.width, o.height)

		Draw.ctx.fillStyle = 'white'
		Draw.ctx.font = '25px Arial'
		Draw.ctx.fillText(`${Math.floor(o.x)} - ${Math.floor(o.y)}`, o.x + 20, o.y + o.height / 2)
	}

	static player(player) {
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

		Draw.ctx.save()

		Draw.ctx.translate(player.x + player.width / 2, player.y + player.height / 2)

		Draw.ctx.drawImage(
			playerImage,
			-newWidth / 2,
			-newHeight / 2,
			newWidth,
			newHeight,
		)

		Draw.ctx.restore()
	}

	static grid() {
		Draw.ctx.strokeStyle = '#ccc' // Grid color
		Draw.ctx.lineWidth = 2

		const cellSize = 100 // Adjust this to change the grid cell size
		const mapWidth = 1000 // Adjust this to match your map's width
		const mapHeight = 1000 // Adjust this to match your map's height
		const rows = Math.floor(mapHeight / cellSize)
		const columns = Math.floor(mapWidth / cellSize)

		for (let i = 0; i < rows; i++) {
			Draw.ctx.beginPath()
			Draw.ctx.moveTo(0, i * cellSize)
			Draw.ctx.lineTo(mapWidth, i * cellSize)
			Draw.ctx.stroke()
		}

		Draw.ctx.beginPath()
		Draw.ctx.moveTo(0, mapHeight)
		Draw.ctx.lineTo(mapWidth, mapHeight)
		Draw.ctx.stroke()

		for (let j = 0; j < columns; j++) {
			Draw.ctx.beginPath()
			Draw.ctx.moveTo(j * cellSize, 0)
			Draw.ctx.lineTo(j * cellSize, mapHeight)
			Draw.ctx.stroke()
		}

		Draw.ctx.beginPath()
		Draw.ctx.moveTo(mapWidth, 0)
		Draw.ctx.lineTo(mapWidth, mapHeight)
		Draw.ctx.stroke()
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
	static fill(color) {
		Draw.ctx.fillStyle = color
		Draw.ctx.fillRect(0, 0, Palette.width, Palette.height)
	}

	// static crate(ctx, position) {
	// 	Draw.crateImage.draw(ctx, position)
	// }
}
