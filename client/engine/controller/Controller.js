export class Controller {

	static init() {
		this.entity = null
	}

	static control(o) {
		this.entity = o
	}

	static update() {
		if (this.entity) {
			const d = NormalizeVector(this.inputDirection())

			const multiplier = 500

			this.entity.velocity.x = d.x * multiplier
			this.entity.velocity.y = d.y * multiplier
		}
	}

	static inputDirection() {
		const up =  { x: 0, y: -1 }
		const down = { x: 0, y: 1 }
		const left = { x: -1, y: 0 }
		const right = { x: 1, y: 0 }

		let x = 0
		let y = 0

		if (Keyboard.up || GamePad.up) {
			x += up.x
			y += up.y
		}

		if (Keyboard.down || GamePad.down) {
			x += down.x
			y += down.y
		}

		if (Keyboard.left || GamePad.left) {
			x += left.x
			y += left.y
		}

		if (Keyboard.right || GamePad.right) {
			x += right.x
			y += right.y
		}

		return {x, y}
	}

}
