export class EnterVehicleExtension {
	constructor(player, vehicle, cameraFollow) {
		this.player = player
		this.vehicle = vehicle
		this.cameraFollow = cameraFollow
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
			this.cameraFollow(this.vehicle.position.center)

			this.player.x = this.vehicle.x
			this.player.y = this.vehicle.y
		}
		else {
			this.controller.control(this.player)
			this.cameraFollow(this.player.position.center)
		}

		this.controller.update()
		this.vehicle.update()
	}

	draw(ctx) {
		this.player.draw(ctx)

		if (this.entered) {
			this.vehicle.draw(ctx)
			Draw.new_text(ctx, this.vehicle.position, 'F to exit')
		}
		else {
			this.vehicle.draw(ctx)

			if (Distance.withinRadius(this.player, this.vehicle, 100)) {
				Draw.new_text(ctx, this.vehicle.position, 'E to enter')
			}
		}
	}
}
