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
			const m = 500

			this.entity.velocity.x = d.x * m
			this.entity.velocity.y = d.y * m
		}
	}

	static inputDirection() {

		if (Gamepad.active) {
			return {
				x: Gamepad.x,
				y: Gamepad.y,
			}
		}
		else {
			let x = 0
			let y = 0

			if (Keyboard.up) {
				x += 0
				y += -1
			}
			if (Keyboard.down) {
				x += 0
				y += 1
			}
			if (Keyboard.left) {
				x += -1
				y += 0
			}
			if (Keyboard.rightt) {
				x += 1
				y += 0
			}

			return { x, y }
		}
	}

}
