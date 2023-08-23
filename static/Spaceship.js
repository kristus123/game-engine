import { GameObject } from '/static/GameObject.js';
import { Draw } from '/static/Draw.js'
import { Distance } from '/static/Distance.js'

export class Spaceship extends GameObject {
	constructor(player) {
		super(0, 0, 20, 20)

		this.player = player
		this.entered = false

		this.spent = {
			inside: 0,
			outside: 0,
			
		}
	}

	update() {
		if (this.entered) {
			this.spent.inside ++
		} else {
			this.spent.outside ++
		}

		if (!this.entered && this.player.keyboard.e) {
			this.entered = true
			this.spent.outside = 0
		}
		else if (this.entered && this.player.keyboard.e) {
			this.entered = false
		}

		if (this.entered) {
			this.timeSpentInSpaceship++

			this.x = this.player.x
			this.y = this.player.y
			this.velocity = this.player.velocity
		}
	}

	draw(ctx) {
		Draw.spaceship(ctx, this)

		if (!this.entered && Distance.withinRadius(this.player, this, 100)) {
			Draw.text(ctx, this.x, this.y, 150, 50, 'E to enter')
		}
		if (this.entered) {
			Draw.text(ctx, this.x, this.y, 150, 50, 'E to exit')
			
		}
	}

}
