export class FishingRod {
	constructor(player) {

		this.fishingRod = null

		Mouse.addOnClick('throw fishing rod', p => {
			this.fishingRod = p
			console.log("hei")
		})
	}

	draw(draw, guiDraw) {
		if (this.fishingRod) {
			draw.text(this.fishingRod.offset(0, -20), 'no fish')
			draw.new_circle(this.fishingRod)
		}
		
	}
}
