import { GameObject } from '/static/GameObject.js';
import { Draw } from '/static/Draw.js';
import { Distance } from '/static/Distance.js';

export class Spaceship extends GameObject {
	constructor() {
		super(100, 0, 20, 20)

		this.entered = false
	}

	update() {
		if (this.owner.keyboard.e && !this.entered && Distance.withinRadius(this, this.owner, 100)) {
			console.log("entered spaceship")
			this.entered = true
		}
	}

	draw(ctx) {
		Draw.spaceship(ctx, this)

		if (!this.entered && Distance.withinRadius(this, this.owner, 100)) {
			Draw.text(ctx, this.x, this.y, 100, 100, 'press E to enter')
		}
	}

}
