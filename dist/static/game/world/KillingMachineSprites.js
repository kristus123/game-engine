import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 

export class KillingMachineSprites {
	constructor(position) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

		this.idle = new Sprite(position, '/static/assets/killing_machine_48x16.png', [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
		])

		this.kill = new TriggerSprite(position, '/static/assets/killing_machine_48x16.png', [
			{ x: 4, y: 0 },
			{ x: 5, y: 0 },
			{ x: 6, y: 0 },
			{ x: 7, y: 0 },
			{ x: 8, y: 0 },
			{ x: 9, y: 0 },
			{ x: 10, y: 0 },
			{ x: 11, y: 0 },
			{ x: 12, y: 0 },
			{ x: 13, y: 0 },
			{ x: 14, y: 0 },
			{ x: 15, y: 0 },
		])
	}

	update() {
	}

	draw(draw, guiDraw) {
		if (this.kill.playing) {
			this.kill.draw(draw, guiDraw)
		}
		else {
			this.idle.draw(draw, guiDraw)
		}
	}
}
