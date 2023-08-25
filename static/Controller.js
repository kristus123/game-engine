import { Keyboard } from '/static/Keyboard.js'

export class Controller {
		
	constructor(objectToControl) {
		this.objectToControl = objectToControl
		this.keyboard = new Keyboard()
	}

	update() {
		if (this.keyboard.up) {
			this.objectToControl.velocity.y -= this.objectToControl.velocityFactor
		}

		if (this.keyboard.down) {
			this.objectToControl.velocity.y += this.objectToControl.velocityFactor
		}

		if (this.keyboard.left) {
			this.objectToControl.velocity.x -= this.objectToControl.velocityFactor
		}

		if (this.keyboard.right) {
			this.objectToControl.velocity.x += this.objectToControl.velocityFactor
		}
	}

	control(o) {
		this.objectToControl = o
	}
	
}
