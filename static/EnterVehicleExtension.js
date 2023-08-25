import { Distance } from '/static/Distance.js'
import { Draw } from '/static/Draw.js'
import { Controller } from '/static/Controller.js'

export class EnterVehicleExtension {
	constructor(player, vehicle, level) {
		this.player = player
		this.vehicle = vehicle
		this.level = level
		this.controller = new Controller(player)

		this.entered = false
	}

	update() {
		if (Distance.withinRadius(this.player, this.vehicle, 100) && this.controller.keyboard.e) {
			this.entered = true
		}
		else if (this.entered && this.controller.keyboard.f) {
			this.entered = false
			this.player.x = this.vehicle.x + 50
			this.player.velocity.x = 400
			this.player.velocity.y = 0
		}

		if (this.entered) {
			this.controller.control(this.vehicle)
			this.level.objectToFollow = this.vehicle

			this.player.x = this.vehicle.x
			this.player.y = this.vehicle.y
		}
		else {
			this.controller.control(this.player)
			this.level.objectToFollow = this.player
		}

		this.controller.update()
	}

	draw(ctx) {
		if (this.entered) {
			this.vehicle.draw(ctx)
			Draw.text(ctx, this.vehicle.x, this.vehicle.y, 150, 100, 'F to exit')
		}
		else {
			this.player.draw(ctx)
			this.vehicle.draw(ctx)

			if (Distance.withinRadius(this.player, this.vehicle, 100)) {
				Draw.text(ctx, this.vehicle.x, this.vehicle.y, 100, 100, 'E to enter')
			}
		}

	}
}
