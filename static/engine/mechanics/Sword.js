export class Sword {
	constructor(player, hittableObjects) {
		this.localObjects = new LocalObjects()
	}
	
	update() {
		for (const o of this.hittableObjects) {
			if (o.within(100, this.player.position.center) && Mouse.down) {
				console.log("cut")
				o.removeFromLoop()
			}
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		draw.splash(this.player, Mouse.position, 200)
		this.localObjects.draw(draw, guiDraw)
	}
}
