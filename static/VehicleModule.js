import { Distance } from '/static/Distance.js'
import { Draw } from '/static/Draw.js'
import { ControllerModule } from '/static/ControllerModule.js'

export class VehicleModule {
	constructor(player, vehicle, level) {
		this.player = player
		this.vehicle = vehicle
		this.level = level
		this.controllerModule = new ControllerModule(player)

		this.entered = false
	}

	update() {
		if (Distance.withinRadius(this.player, this.vehicle, 100) && this.controllerModule.keyboard.e) {
			this.entered = true
		}
		else if (this.entered && this.controllerModule.keyboard.f) {
			this.entered = false
			this.player.x = this.vehicle.x + 50
			this.player.velocity.x = 400
			this.player.velocity.y = 0
		}

		if (this.entered) {
			this.controllerModule.control(this.vehicle)
			this.level.objectToFollow = this.vehicle

			this.player.x = this.vehicle.x
			this.player.y = this.vehicle.y
		}
		else {
			this.controllerModule.control(this.player)
			this.level.objectToFollow = this.player
		}

		this.controllerModule.update()
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
