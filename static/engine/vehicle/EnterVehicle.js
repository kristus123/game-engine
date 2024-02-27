export class EnterVehicle {
	constructor(vehicle, player, camera, controller) {

		this.entered = false

		new KeypressEvent().addKeyDownListener('e', () => {
			if (this.entered) {
				this.entered = false

				Call(this.onExit)
				controller.control(player)
				camera.follow(player)

				this.player.x = vehicle.x
				this.player.y = vehicle.y
			}
			else if (Distance.withinRadius(player, vehicle, 100)) {
				this.entered = true

				Call(this.onEnter)
				controller.control(vehicle)
				camera.follow(vehicle)

				this.player.x = -999999
				this.player.y = -999999
			}
		})
	}

	draw(draw) {
		if (!this.entered && Distance.withinRadius(this.player, this.vehicle, 100)) {
			draw.new_text(this.vehicle.position, 'E to enter')
		}
	}
}
