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

	// todo fix deltatime bug here
	// this is the reason why it goes twice as fast on 120 fps
	static update(speed) {
		console.log(this.objectToControl.velocity)

		const xxx = 1000
		
		if (!this.objectToControl || this.disabled) {
			return
		}

		const inputDir = normalizeVector(Controller.getInputDir())
		this.objectToControl.velocity.x = inputDir.x * xxx * DeltaTime.value
		this.objectToControl.velocity.y = inputDir.y * xxx * DeltaTime.value

	}

	static getInputDir() {
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
