export class SmoothPosition {
	constructor(targetPosition, smoothness = 0.15, snapThreshold = 1) {
		this.actualPosition = targetPosition.copy()
	}

	update() {
		const dx = this.targetPosition.x - this.actualPosition.x
		const dy = this.targetPosition.y - this.actualPosition.y

		if (dx === 0 && dy === 0) {
			return this
		}

		let moveX = Math.round(dx * this.smoothness)
		let moveY = Math.round(dy * this.smoothness)

		if (moveX === 0 && dx !== 0) {
			moveX = Math.sign(dx)
		}
		if (moveY === 0 && dy !== 0) {
			moveY = Math.sign(dy)
		}

		this.actualPosition.x += moveX
		this.actualPosition.y += moveY

		if (Math.abs(this.targetPosition.x - this.actualPosition.x) <= this.snapThreshold) {
			this.actualPosition.x = this.targetPosition.x
		}
		if (Math.abs(this.targetPosition.y - this.actualPosition.y) <= this.snapThreshold) {
			this.actualPosition.y = this.targetPosition.y
		}

		return this
	}
}
