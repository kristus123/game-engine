import { Draw } from '/static/Draw.js'
import { Distance } from '/static/Distance.js'

export class EnterHouseExtension {
	constructor(player) {
		this.player = player

		this.door = {
			x: -900,
			y: 0,
			width: 100,
			heigt: 100,
		}

		this.inside = false
	}

	update() {
		if (Distance.withinRadius(this.door, this.player, 200)) {
			this.inside = true
		} else if (!Distance.withinRadius(this.door, this.player, 500)) {
			this.inside = false
		}
	}

	draw(ctx) {
		Draw.rectangle(
			ctx,
			this.door.x,
			this.door.y,
			this.door.width,
			this.door.heigt,
		)

		if (this.inside) {
			Draw.rectangle(
				ctx,
				this.door.x - 500,
				this.door.y - 500,
				1000,
				1000,
			)
			Draw.text(
				ctx,
				this.door.x - 100,
				this.door.y - 100,
				100,
				100,
				'bed',
			)
		}
	}
}
