export class FollowPlayerNoise {
	constructor(player, viewable=4000, size=30) {
		this.simplexNoise = SimplexNoise(0.001)

		this.gridArea = player.position.offset(-viewable/2, (-viewable/2), viewable, viewable)

		this.t = 0

		this.blue = p => {}
	}

	draw(draw) {

		for (const position of Positions.grid(this.gridArea, this.size)) {
			// this.t += 0.0001
			const noiseValue = this.simplexNoise.noise(position, this.t)

			if (noiseValue >= 0.8) {
				draw.color(position, "#2AB1C6")
			}
			else {
				draw.color(position, "#4F9182")
			}
		}
	}
}
