import { Distance } from '/static/Distance.js'
import { Draw } from '/static/Draw.js'

export class VehicleModule {
	constructor(player, vehicle) {
		this.player = player
		this.vehicle = vehicle

		this.entered = false
	}

	update() {
		if (Distance.withinRadius(this.player, this.vehicle, 100) && this.player.keyboard.e) {
			this.entered = true
		}
	}

	draw(ctx) {
		if (this.entered) {
			this.vehicle.draw(ctx)
		}
		else {
			this.player.draw(ctx)
			this.vehicle.draw(ctx)

			if (Distance.withinRadius(this.player, this.vehicle, 100)) {
				Draw.text(ctx, this.vehicle.x, this.vehicle.y, 100, 100, 'E')
			}
		}

	}
}
