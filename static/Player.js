import { GameObject } from "/static/GameObject.js"
import { Keyboard } from "/static/Keyboard.js"
import { Draw } from '/static/Draw.js';

export class Player extends GameObject {
	constructor() {
		super(0, 0, 20, 20)
		this.keyboard = new Keyboard()
	}

	update() {
		if (this.keyboard.up) {
			this.velocity.y -= 20
		}

		if (this.keyboard.down) {
			this.velocity.y += 20
		}

		if (this.keyboard.left) {
			this.velocity.x -= 20
		}
		if (this.keyboard.right) {
			this.velocity.x += 20
		}
	}

	draw(ctx) {
		Draw.player(ctx, this)
	}
}

