export class Angle {
	constructor(position, angleRange=20, radius=100) {
		this.blue = 'rgba(0, 0, 255, 0.1)' // Example color with transparency
		this.red = 'rgba(255, 0, 0, 0.1)' // Example color with transparency
		this.color = this.blue
	}

	within(position) {
		const deltaX = position.x - this.playerPosition.x
		const deltaY = position.y - this.playerPosition.y
		const angleToPoint = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

		const normalizedAngle = (angleToPoint + 360) % 360

		const mouseAngle = Math.atan2(Mouse.position.y - this.playerPosition.y, Mouse.position.x - this.playerPosition.x) * (180 / Math.PI)
		const normalizedMouseAngle = (mouseAngle + 360) % 360

		const halfRange = this.angleRange / 2
		const startAngle = (normalizedMouseAngle - halfRange + 360) % 360
		const endAngle = (normalizedMouseAngle + halfRange) % 360


		const withinAngle = (startAngle < endAngle)
			? normalizedAngle >= startAngle && normalizedAngle <= endAngle
			: normalizedAngle >= startAngle || normalizedAngle <= endAngle

		return withinAngle && Distance.within(this.radius, this.playerPosition, position)
	}

	draw(draw, guiDraw) {
		draw.angleFrom(this.position, Registry.player, this.radius, this.angleRange, this.color)
	}
}
