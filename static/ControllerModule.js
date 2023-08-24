import { Keyboard } from '/static/Keyboard.js'

export class ControllerModule {
		
	constructor(objectToControl) {
		this.objectToControl = objectToControl
		this.keyboard = new Keyboard()
	}

	update() {
		if (this.keyboard.up) {
			this.objectToControl.velocity.y -= 20
		}

		if (this.keyboard.down) {
			this.objectToControl.velocity.y += 20
		}

		if (this.keyboard.left) {
			this.objectToControl.velocity.x -= 20
		}

		if (this.keyboard.right) {
			this.objectToControl.velocity.x += 20
		}
	}

	control(o) {
		this.objectToControl = o
	}
	
}
