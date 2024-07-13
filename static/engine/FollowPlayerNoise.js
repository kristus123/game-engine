export class FollowPlayerNoise {
	constructor(player, viewable=1, size=10) {
		this.simplexNoise = new SimplexNoise(0.001)

		this.gridArea = player.position.offset(-viewable/2, (-viewable/2), viewable, viewable)

		this.t = 0

		this.blue = p => {}
	}

	draw(draw, guiDraw) {

		for (const position of Positions.grid(this.gridArea, this.size)) {
			// this.t += 0.001
			const noiseValue = this.simplexNoise.noise(position, this.t)

			if (noiseValue >= 0.5) {
				// draw.color(position, '#2AB1C6')
			}
			else {
				draw.color(position, '#4F9182')
			}
		}
	}
}
