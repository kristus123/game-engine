import { GameObject } from '/static/GameObject.js';
import { Draw } from '/static/Draw.js'
import { Distance } from '/static/Distance.js'

export class Spaceship extends GameObject {
	constructor(player) {
		super(0, 0, 20, 20)

		this.player = player
		this.entered = false
	}

	update() {
		if (!this.entered && this.player.keyboard.e && Distance.withinRadius(this.player, this, 100)) {
			this.player.velocity = {
				x: 0,
				y: 0,
			}
			this.player.x = this.x
			this.player.y = this.y

			this.entered = true
		}

		if (this.entered) {
			this.velocity = this.player.velocity
		}
	}

	draw(ctx) {
		Draw.spaceship(ctx, this)

		if (!this.entered && Distance.withinRadius(this.player, this, 100)) {
			Draw.text(ctx, this.x, this.y, 150, 50, 'E to enter')
		}
	}

}
