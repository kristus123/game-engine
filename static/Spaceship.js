import { GameObject } from '/static/GameObject.js';

export class Spaceship extends GameObject {
	constructor() {
		super(100, 0, 20, 20)

		this.entered = false
	}

	update() {
	}

	draw(ctx) {
	}

}
