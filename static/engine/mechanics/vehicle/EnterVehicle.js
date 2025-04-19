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
			else if (Collision.between(player, vehicle)) {
				this.entered = true

				Call(this.onEnter)
				Controller.control(vehicle)
				Camera.follow(vehicle)
				// Camera.zoom = 0.5
			}
		})
	}

	update() {
		if (this.entered) {
			this.player.x = this.vehicle.x + 450
			this.player.y = this.vehicle.y
		}
	}

	draw(draw, guiDraw) {
		if (!this.entered && Collision.between(this.player, this.vehicle)) {
			draw.text(this.vehicle.position, 'E to enter')
		}
	}
}
