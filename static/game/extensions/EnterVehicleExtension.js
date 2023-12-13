export class EnterVehicleExtension {
	constructor(player, vehicle, cameraFollow) {
		this.player = player
		this.vehicle = vehicle
		this.cameraFollow = cameraFollow
		this.controller = new Controller(player)

		this.entered = false

		this.keyboardEvents = new KeypressEvent()

		this.keyboardEvents.addKeyDownListener('e', () => {
			if (this.entered) {
				this.entered = false
				this.player.x = this.vehicle.x
				this.player.y = this.vehicle.y
			}
			else if (Distance.withinRadius(this.player, this.vehicle, 100)) {
				this.entered = true
			}
		})
	}

	update() {
		if (this.entered) {
			this.controller.control(this.vehicle)
			this.cameraFollow(this.vehicle.position.center)

		}
		else {
			this.controller.control(this.player)
			this.cameraFollow(this.player.position.center)
		}

		this.controller.update()
		this.vehicle.update()
	}

	draw(ctx) {

		if (this.entered) {
			this.vehicle.draw(ctx)
			Draw.new_text(ctx, this.vehicle.position, 'E to exit')
		}
		else {
			this.player.draw(ctx)
			this.vehicle.draw(ctx)

			if (Distance.withinRadius(this.player, this.vehicle, 100)) {
				Draw.new_text(ctx, this.vehicle.position, 'E to enter')
			}
		}
	}
}
