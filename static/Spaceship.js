import { GameObject } from '/static/GameObject.js';
import { Draw } from '/static/Draw.js'

export class Spaceship extends GameObject {
	constructor() {
		super(0, 0, 20, 20)
	}

	update() {
	}

	draw(ctx) {
		Draw.spaceship(ctx, this)
	}

}