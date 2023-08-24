import { GameObject } from "/static/GameObject.js"
import { Draw } from '/static/Draw.js';

export class Player extends GameObject {
	constructor() {
		super(0, 0, 20, 20, 100, 50)
	}

	update() {
	}

	draw(ctx) {
		Draw.player(ctx, this)
	}
}

