export class Draw {

	constructor(ctx) {
		this.ctx = ctx

		this.angle = 0 // temporary hack
	}

	// drawTextInCenter(text, centerPosition) {
	// 	this.ctx.fillStyle = 'white';
	// 	this.ctx.font = '25px Arial';

	// 	// Set text alignment to center
	// 	this.ctx.textAlign = 'center';
	// 	this.ctx.textBaseline = 'middle';

	// 	// Draw text in the middle of the rectangle
	// 	this.ctx.fillText(text, centerPosition.x, centerPosition.y);
	// }

	new_rectangle(position, color='yellow') {
		this.ctx.fillStyle = color
		this.ctx.fillRect(position.x, position.y, position.width, position.height)

		this.ctx.strokeStyle = color
		this.ctx.lineWidth = 4
		this.ctx.strokeRect(position.x, position.y, position.width, position.height)

		this.ctx.fillStyle = 'white'
		this.ctx.font = '25px Arial'

	}

	gradient(position) {
		const radius = 1500

		const scaledX = position.x
		const scaledY = position.y

		const gradient = this.ctx.createRadialGradient(scaledX, scaledY, 200, scaledX, scaledY, radius)
		// Add transparent colors with alpha channel
		gradient.addColorStop(0, 'rgba(255, 0, 0, 0.2)') // Inner color (fully transparent red)
		gradient.addColorStop(0.5, 'rgba(0, 0, 255, 1)') // Middle color (partially transparent blue)
		gradient.addColorStop(1, 'rgba(0, 0, 255, 0)') // Middle color (partially transparent blue)

		this.ctx.fillStyle = gradient
		this.ctx.beginPath()
		this.ctx.arc(scaledX, scaledY, radius, 0, 2 * Math.PI)
		this.ctx.fill()
	}

	star(position, color='white') {
		this.ctx.lineWidth = 0
		this.ctx.fillStyle = color
		this.ctx.strokeStyle = color
		this.rectangle(position.x, position.y, position.width, position.height, color)
	}

	rectangle(x, y, width, height, color = 'orange') {
		this.ctx.fillStyle = color
		this.ctx.fillRect(x, y, width, height)

		this.ctx.strokeStyle = color
		this.ctx.lineWidth = 4
		this.ctx.strokeRect(x, y, width, height)
	}

	blueRectangle(x, y) {
		this.ctx.fillStyle = 'blue'
		this.ctx.fillRect(x, y, 10, 10)
	}

	splash(spawnPosition, targetLocation, angleWidth, length = 500) {
		this.ctx.beginPath()

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
		this.ctx.moveTo(spawnPosition.x, spawnPosition.y)
		this.ctx.lineTo(leftX, leftY)

		this.ctx.moveTo(spawnPosition.x, spawnPosition.y)
		this.ctx.lineTo(rightX, rightY)

		// Set line style
		this.ctx.lineWidth = 2
		this.ctx.strokeStyle = 'red' // You can set your desired color

		// Stroke the lines
		this.ctx.stroke()
		this.ctx.closePath()
	}

	hpBar(position, currentHp, maxHp) {
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

		this.ctx.fillStyle = 'white'
		this.ctx.fillRect(position.x, position.y, width, height)

		this.ctx.fillStyle = 'red'
		this.ctx.fillRect(position.x, position.y, currentHP * width, height)
	}

	circle(x, y, radius, color) {
		this.ctx.beginPath()
		this.ctx.arc(x, y, radius, 0, Math.PI * 2, false)
		this.ctx.fillStyle = color
		this.ctx.fill()
	}

	new_circle(position, radius = 10) {
		const color = 'red'

		this.ctx.beginPath()
		this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, false)
		this.ctx.fillStyle = color
		this.ctx.fill()
	}

	hollowCircle(position, color, radius) {
		this.ctx.strokeStyle = color
		this.ctx.lineWidth = 6

		this.ctx.beginPath()
		this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2)
		this.ctx.stroke()
	}

	// todo must be updated somehow iwthin game lloop
	circleSpinning(objectToFollow, radius) {
		const x =
			objectToFollow.x +
			objectToFollow.width / 2 +
			radius * Math.cos(this.angle)
		const y =
			objectToFollow.y +
			objectToFollow.height / 2 +
			radius * Math.sin(this.angle)

		this.circle(x, y, 10, 'red')

		this.angle += 0.1

		return {
			x,
			y,
		}
	}

	// needs some work obviously, but it works
	revertMouse(player, mousePosition) {
		function getAngle(x1, y1, x2, y2) {
			return Math.atan2(y2 - y1, x2 - x1)
		}

		player.angle = 0
		const playerRadius = 20
		const circleRadius = 50

		const oppositeAngle = player.angle + Math.PI
		const circleX = player.x + player.width / 2 + circleRadius * Math.cos(oppositeAngle)
		const circleY = player.y + player.height / 2 + circleRadius * Math.sin(oppositeAngle)

		this.circle(circleX, circleY, playerRadius, 'red')

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

	objectThatIsMovingInRectangularPathAroundObject(player, mousePosition) {
		this.ctx.lineWidth = 2

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
		this.circle(circleX, circleY, playerRadius, 'red')

		// Draw the rectangle
		const rectX = player.position.center.x - horizontalRectDistance
		const rectY = player.position.center.y - verticalRectDistance
		const rectWidth = horizontalRectDistance * 2
		const rectHeight = verticalRectDistance * 2

		this.ctx.strokeStyle = 'blue'
		this.ctx.strokeRect(rectX, rectY, rectWidth, rectHeight)

		return { x: circleX, y: circleY }
	}

	// needs some work obviously, but it works
	objectThatIsCirclingAroundObjectBasedOnMousePosition(
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

		this.circle(circleX, circleY, playerRadius, 'red')
	}

	lineBetween(start, end) {
		this.ctx.beginPath()
		this.ctx.moveTo(start.x, start.y)
		this.ctx.lineTo(end.x, end.y)
		this.ctx.strokeStyle = 'white'
		this.ctx.lineWidth = 5
		this.ctx.stroke()
	}

	text(x, y, width, height, text) {
		this.ctx.fillStyle = 'white'
		this.ctx.font = '25px Arial'
		this.ctx.fillText(text, x + 20, y + height / 2)
	}

	new_text(position, text, color='white', fontSize = 40) {
		this.new_rectangle(position)

		this.ctx.fillStyle = 'black'

		this.ctx.font = `${fontSize}px Arial`

		const textWidth = this.ctx.measureText(text).width

		this.ctx.fillRect(position.x, position.y - fontSize - 20, textWidth, fontSize + 40)

		this.ctx.fillStyle = color
		this.ctx.fillText(text, position.x, position.y)
	}


	position(o) {
		this.rectangle(o.x, o.y, o.width, o.height)

		this.ctx.fillStyle = 'white'
		this.ctx.font = '25px Arial'
		this.ctx.fillText(`${Math.floor(o.x)} - ${Math.floor(o.y)}`, o.x + 20, o.y + o.height / 2)
	}

	grid() {
		this.ctx.strokeStyle = '#ccc' // Grid color
		this.ctx.lineWidth = 2

		const cellSize = 100 // Adjust this to change the grid cell size
		const mapWidth = 1000 // Adjust this to match your map's width
		const mapHeight = 1000 // Adjust this to match your map's height
		const rows = Math.floor(mapHeight / cellSize)
		const columns = Math.floor(mapWidth / cellSize)

		for (let i = 0; i < rows; i++) {
			this.ctx.beginPath()
			this.ctx.moveTo(0, i * cellSize)
			this.ctx.lineTo(mapWidth, i * cellSize)
			this.ctx.stroke()
		}

		this.ctx.beginPath()
		this.ctx.moveTo(0, mapHeight)
		this.ctx.lineTo(mapWidth, mapHeight)
		this.ctx.stroke()

		for (let j = 0; j < columns; j++) {
			this.ctx.beginPath()
			this.ctx.moveTo(j * cellSize, 0)
			this.ctx.lineTo(j * cellSize, mapHeight)
			this.ctx.stroke()
		}

		this.ctx.beginPath()
		this.ctx.moveTo(mapWidth, 0)
		this.ctx.lineTo(mapWidth, mapHeight)
		this.ctx.stroke()
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

		return function drawFrame() {
			const frameInfo = frameSequence[currentFrameIndex]
			const currentFrameX = frameInfo.x
			const currentFrameY = frameInfo.y

			this.ctx.imageSmoothingEnabled = false
			this.ctx.drawImage(
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
	fill(color) {
		this.ctx.fillStyle = color
		this.ctx.fillRect(0, 0, Palette.width, Palette.height)
	}

	// static crate(ctx, position) {
	// 	Draw.crateImage.draw(ctx, position)
	// }
}
