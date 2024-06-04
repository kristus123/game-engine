export class EnterVehicle {
	constructor(vehicle, player) {

		this.entered = false

		KeyDown('e', () => {
			if (this.entered) {
				this.entered = false

				Call(this.onExit)
				Controller.control(player)
				Camera.follow(player)
				Camera.zoom = 1

				this.player.x = vehicle.x
				this.player.y = vehicle.y
			}
			else if (Distance.withinRadius(player, vehicle, 100)) {
				this.entered = true

				Call(this.onEnter)
				Controller.control(vehicle)
				Camera.follow(vehicle)
				Camera.zoom = 0.5

				this.player.x = -999999
				this.player.y = -999999
			}
		})
	}

	update() {
		if (this.entered) {
			this.player.x = this.vehicle.x
			this.player.y = this.vehicle.y
		}
	}


	draw(draw, guiDraw) {
		if (!this.entered && Distance.withinRadius(this.player, this.vehicle, 100)) {
			draw.new_text(this.vehicle.position, 'E to enter')
		}
	}
}
