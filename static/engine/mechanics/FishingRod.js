export class FishingRod {
	constructor(player) {
		this.noise = new Noise(new Position(-1000, -500, 1000, 1000), 20)

		this.fishingRod = null

		Mouse.addOnClick('throw fishing rod', p => {
			this.fishingRod = p
			this.countdown = 100
		})

		this.countdown = 100
		this.amount = 0
	}

	draw(draw) {
		this.noise.draw(draw)

		draw.text(this.player.position.offset(-180, -20), this.amount + ' fishes caught')

		if (this.fishingRod) {
			draw.line(this.player, this.fishingRod)
			draw.new_circle(this.fishingRod)
			if (this.noise.red(this.fishingRod)) {
				draw.text(this.fishingRod.offset(-120, -20), this.countdown)
				this.countdown -= 1
				if (this.countdown <= 0) {
					draw.text(this.fishingRod.offset(-120, -20), 'PULL IN (right click)')

					if (Mouse.rightDown) {
						this.countdown = 100
						this.amount += 1
						this.fishingRod = null
					}
				}
				else {
					if (Mouse.rightDown) {
						this.countdown = 100
						this.fishingRod = null
					}
				}
			}
			else {
				draw.text(this.fishingRod.offset(-180, -20), 'Patience')
				this.countdown = 100
			}
		}
	}
}
