import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Palette } from '/static/engine/core/Palette.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Text } from '/static/engine/mechanics/dialogue/Text.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class Draw {

	constructor(ctx) {

				AssertNotNull(ctx, "argument ctx in " + this.constructor.name + ".js should not be null")
			
		this.ctx = ctx; 

		this.angle = 0 // temporary hack
	}

	angleFrom(p1, p2, radius, angleRange, color) {

		const mouseAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x)

		const halfRange = angleRange / 2
		const startAngleRad = mouseAngle - (halfRange * Math.PI / 180)
		const endAngleRad = mouseAngle + (halfRange * Math.PI / 180)


		this.ctx.beginPath()
		this.ctx.moveTo(p1.x, p1.y)
		this.ctx.arc(
			p1.x,
			p1.y,
			radius,
			startAngleRad,
			endAngleRad,
		)

		this.ctx.lineTo(p1.x, p1.y)
		this.ctx.fillStyle = color
		this.ctx.fill()
	}

	angleFromMouse(position, radius, angleRange, color) {
		this.angleFrom(position, Mouse, radius, angleRange, color)
	}

	test(position) { // Can be used for making a light source on a flat wall
		const gradientWidth = 800 // Width of the gradient area
		const gradientHeight = 400 // Height of the gradient area

		const gradient = this.ctx.createLinearGradient(
			position.x - gradientWidth / 2, position.y - gradientHeight / 2, // Starting point of the gradient
			position.x + gradientWidth / 2, position.y + gradientHeight / 2 // Ending point of the gradient
		)

		// Add transparent colors with alpha channel
		gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)') // Starting color (brighter center)
		gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)') // Middle color (fades outwards)
		gradient.addColorStop(1, 'rgba(255, 255, 255, 0)') // End color (fully transparent)

		this.ctx.fillStyle = gradient
		this.ctx.fillRect(position.x - gradientWidth / 2, position.y - gradientHeight / 2, gradientWidth, gradientHeight)
	}



	lightSource(lightSource, radius) {
		const gradient = this.ctx.createRadialGradient(lightSource.x, lightSource.y, 0, lightSource.x, lightSource.y, radius)
		gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
		gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

		this.ctx.fillStyle = gradient
		this.ctx.fillRect(0, 0, Palette.width, Palette.height)
	}

	curve(startPosition, controlPosition1, controlPosition2, endPosition) {
		this.ctx.beginPath()
		this.ctx.moveTo(startPosition.x, startPosition.y) // Starting point
		this.ctx.bezierCurveTo(controlPosition1.x, controlPosition1.y, controlPosition2.x, controlPosition2.y, endPosition.x, endPosition.y) // Control points and endpoint
		this.ctx.strokeStyle = 'white' // Set the stroke color to white
		this.ctx.stroke()

		// this.new_circle(startPosition);
		// this.new_circle(controlPosition1); // Optionally show control point 1
		// this.new_circle(controlPosition2); // Optionally show control point 2
		// this.new_circle(endPosition);
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

	sprite(position, frame, image) {
		this.ctx.imageSmoothingEnabled = false

		this.ctx.drawImage(
			image,
			frame.x,
			frame.y,
			frame.width,
			frame.height,
			position.x,
			position.y,
			position.width,
			position.height,
		)
	}

	picture(position, image) {
		this.ctx.imageSmoothingEnabled = false
		this.ctx.drawImage(image, 0, 0)
	}


	imageBitmap(position, imageBitmap) {
		this.ctx.drawImage(imageBitmap, position.x, position.y)
	}

	rectangle(position, color='yellow') {
		this.ctx.fillStyle = color
		this.ctx.fillRect(position.x, position.y, position.width, position.height)

		this.ctx.strokeStyle = color
		this.ctx.lineWidth = 4
		this.ctx.strokeRect(position.x, position.y, position.width, position.height)

		// this.ctx.shadowColor = "red"; // Glow color
		// this.ctx.shadowBlur = 200; // Blur amount

		this.ctx.fillStyle = 'white'
		this.ctx.font = '25px Arial'
	}

	pink(position) {
		this.rectangle(position, 'pink')
	}

	purple(position) {
		this.rectangle(position, 'purple')
	}

	green(position) {
		this.rectangle(position, 'green')
	}

	red(position) {
		this.rectangle(position, 'red')
	}

	brown(position) {
		this.rectangle(position, 'brown')
	}

	orange(position) {
		this.rectangle(position, 'orange')
	}

	blue(position) {
		this.rectangle(position, 'blue')
	}

	color(position, color) {
		this.rectangle(position, color)
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

	transparentBlueRectangle(position) {
		this.ctx.fillStyle = 'rgba(0, 0, 255, 0.5)' // rgba(red, green, blue, alpha)
		this.ctx.fillRect(position.x, position.y, position.width, position.height)
	}

	blueRectangle(position) {
		this.ctx.fillStyle = 'rgba(0, 0, 255, 1)' // rgba(red, green, blue, alpha)
		this.ctx.fillRect(position.x, position.y, position.width, position.height)
	}

	gradient(position) { // can be used for making a light source
		const radius = 300

		const gradient = this.ctx.createRadialGradient(position.x, position.y, 200, position.x, position.y, 50)
		// Add transparent colors with alpha channel
		gradient.addColorStop(0, 'rgba(255, 0, 255, 0.1)') // Inner color (fully transparent red)
		gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)') // Middle color (partially transparent blue)
		gradient.addColorStop(1, 'rgba(255, 255, 0, 0.1)') // Middle color (partially transparent blue)

		this.ctx.fillStyle = gradient
		this.ctx.beginPath()
		this.ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI)
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

		// Stroke the lines this.ctx.stroke() this.ctx.closePath()
	}

	hpBar(position, currentHp, maxHp, color='red') {
		function toPercentage() { // returns a value between 0.0 and 1.0 representing percentage
			const numerator = currentHp
			const denominator = maxHp

			const percentage = (numerator / denominator) * 100

			const displayValue = percentage / 100

			return displayValue
		}

		const width = 200
		const height = 20

		position = {
			x: position.x - 100,
			y: position.y + 50,
		}

		this.ctx.fillStyle = 'white'
		this.ctx.fillRect(position.x, position.y, width, height)


		let currentHP = Math.max(0, toPercentage() - 0.01)

		this.ctx.fillStyle = color
		this.ctx.fillRect(position.x, position.y, currentHP * width, height)
	}

	circle(position, radius = 10) {
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
		const dx = target.x - Camera.position.x
		const dy = target.y - Camera.position.y
		// Calculate the maximum allowed distances for rectangular movement
		const horizontalRectDistance = (Palette.width / 2 - 20)
		const verticalRectDistance = (Palette.height / 2 - 20)
		// Calculate the position for the circle to move in a rectangular path
		let circleX =
			Camera.position.x +
			Math.min(Math.abs(dx), horizontalRectDistance) * Math.sign(dx)
		let circleY =
			Camera.position.y +
			Math.min(Math.abs(dy), verticalRectDistance) * Math.sign(dy)

		// Draw the circle
		const playerRadius = 10
		this.circle(circleX, circleY, playerRadius, color)

		// Draw the rectangle
		const rectX = Camera.position.x - horizontalRectDistance
		const rectY = Camera.position.y - verticalRectDistance
		const rectWidth = horizontalRectDistance * 2
		const rectHeight = verticalRectDistance * 2

		this.ctx.strokeStyle = 'blue'
		this.ctx.strokeRect(rectX, rectY, rectWidth, rectHeight)

		return { x: circleX, y: circleY }
	}

	objectThatIsCirclingAroundObjectBasedOnMousePosition(player) {
		player = {
			x: player.position.center.x,
			y: player.position.center.y,
		}

		const mouse = {
			x: Mouse.position.x,
			y: Mouse.position.y,
		}

		const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x)

		const circleRadius = 150

		const x = player.x + circleRadius * Math.cos(angle)
		const y = player.y + circleRadius * Math.sin(angle)

		this.circle(new Position(x, y), 10, 'red')
	}

	line(start, end) {
		this.ctx.beginPath()
		this.ctx.moveTo(start.x, start.y)
		this.ctx.lineTo(end.x, end.y)
		this.ctx.strokeStyle = 'white'
		this.ctx.lineWidth = 5
		this.ctx.stroke()
	}

	text(position, text, color='black', fontSize = 40) {
		// this.rectangle(position)

		this.ctx.fillStyle = 'white'

		this.ctx.font = `${fontSize / Camera.zoom}px VT323`

		const textWidth = this.ctx.measureText(text).width

		this.ctx.fillRect(position.x, position.y - fontSize - 20, textWidth, fontSize + 40)

		this.ctx.fillStyle = color
		this.ctx.fillText(text, position.x, position.y)
	}

	position(p) {
		this.text(p, `${Math.floor(p.x)} _ ${Math.floor(p.y)}`)
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
