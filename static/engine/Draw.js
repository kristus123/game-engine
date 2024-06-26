export class Draw {

	constructor(ctx) {
		this.angle = 0 // temporary hack
	}

	lightSource(lightSource, radius) {
		const gradient = this.ctx.createRadialGradient(lightSource.x, lightSource.y, 0, lightSource.x, lightSource.y, radius)
		gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
		gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

		this.ctx.fillStyle = gradient
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
	}

	shadow(gameObject) {
		const { x, y, width, height } = gameObject
		const lightX = 0
		const lightY = 0

		this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
		this.ctx.shadowBlur = 200
		this.ctx.shadowOffsetX = (x - lightX) / 10
		this.ctx.shadowOffsetY = (y - lightY) / 10

		this.ctx.fillRect(x, y, width, height)

		this.ctx.shadowColor = 'transparent'
		this.ctx.shadowBlur = 0
		this.ctx.shadowOffsetX = 0
		this.ctx.shadowOffsetY = 0
	}

	rectangle(position, color='yellow') {
		this.ctx.fillStyle = color
		this.ctx.fillRect(position.x, position.y, position.width, position.height)

		this.ctx.strokeStyle = color
		this.ctx.lineWidth = 4
		this.ctx.strokeRect(position.x, position.y, position.width, position.height)

		this.ctx.fillStyle = 'white'
		this.ctx.font = '25px Arial'
	}

	green(position) {
		this.rectangle(position, 'green')
	}

	blue(position) {
		this.rectangle(position, 'blue')
	}

	grey(position) {
		this.rectangle(position, 'grey')
	}

	transparentGreenRectangle(position) {
		this.ctx.fillStyle = 'rgba(0, 255, 0, 0.5)' // RGBA color (green with 50% opacity)
		this.ctx.fillRect(position.x, position.y, position.width, position.height)
	}

	transparentRedRectangle(position) {
		this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)' // rgba(red, green, blue, alpha)
		this.ctx.fillRect(position.x, position.y, position.width, position.height)
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
		this.rectangle(position, color)
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

	revertMouse(player, mousePosition) {
		const playerRadius = 10
		const circleRadius = 100

		const oppositeAngle = player.angle + Math.PI
		const circleX = player.x + player.width / 2 + circleRadius * Math.cos(oppositeAngle)
		const circleY = player.y + player.height / 2 + circleRadius * Math.sin(oppositeAngle)

		this.circle(circleX, circleY, playerRadius, 'red')

		player.angle = Math.atan2(mousePosition.y - player.position.center.y, mousePosition.x - player.position.center.x)
	}

	objectThatIsMovingInRectangularPathAroundObject(target, color='red') {
		this.ctx.lineWidth = 2

		// Calculate distances from player's center to mouse position
		const dx = target.x - Cam.position.x
		const dy = target.y - Cam.position.y
		// Calculate the maximum allowed distances for rectangular movement
		const horizontalRectDistance = (Palette.width / 2 - 20)
		const verticalRectDistance = (Palette.height / 2 - 20)
		// Calculate the position for the circle to move in a rectangular path
		let circleX =
			Cam.position.x +
			Math.min(Math.abs(dx), horizontalRectDistance) * Math.sign(dx)
		let circleY =
			Cam.position.y +
			Math.min(Math.abs(dy), verticalRectDistance) * Math.sign(dy)

		// Draw the circle
		const playerRadius = 10
		this.circle(circleX, circleY, playerRadius, color)

		// Draw the rectangle
		const rectX = Cam.position.x - horizontalRectDistance
		const rectY = Cam.position.y - verticalRectDistance
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

	text(position, text, color='white', fontSize = 40) {
		// this.rectangle(position)

		this.ctx.fillStyle = 'black'

		this.ctx.font = `${fontSize}px VT323`

		const textWidth = this.ctx.measureText(text).width

		this.ctx.fillRect(position.x, position.y - fontSize - 20, textWidth, fontSize + 40)

		this.ctx.fillStyle = color
		this.ctx.fillText(text, position.x, position.y)
	}

	position(o) {
		this.text(o, `${Math.floor(o.x)} _ ${Math.floor(o.y)}`)
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

}
