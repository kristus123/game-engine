export class Controller {

	static init() {
		this.velocity = Velocity(this)
		this.disabled = false
		this.objectToControl = null
	}

	static control(o) {
		this.objectToControl = o
		this.velocity.object = o
	}

	static disable(amountInMs) {
		this.disabled = true

		setTimeout(() => {
			this.disabled = false
		}, amountInMs)
	}

	static update() {
		//console.log(this.objectToControl.velocity)

		if (!this.objectToControl || this.disabled) {
			return
		}

		const d = NormalizeVector(this.inputDirection)
		const multiplier = 10000

		this.objectToControl.velocity.x = d.x * multiplier * DeltaTime.value
		this.objectToControl.velocity.y = d.y * multiplier * DeltaTime.value
	}

	static get inputDirection() {
		const directions = {
			up:    { x:  0, y: -1 },
			down:  { x:  0, y:  1 },
			left:  { x: -1, y:  0 },
			right: { x:  1, y:  0 }
		}

		let vector = { x: 0, y: 0 }

		if (Keyboard.up) {
			vector.x += directions.up.x
			vector.y += directions.up.y
		}

		if (Keyboard.down) {
			vector.x += directions.down.x
			vector.y += directions.down.y
		}

		if (Keyboard.left) {
			vector.x += directions.left.x
			vector.y += directions.left.y
		}

		if (Keyboard.right) {
			vector.x += directions.right.x
			vector.y += directions.right.y
		}

		return vector
	}
}
