import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Draw } from '/static/engine/core/Draw.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 

export class PlayerSprites {
	constructor(player) {

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 

		this.forward = new Sprite(player.position, '/static/assets/farmer_16x16.png', [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
			{ x: 4, y: 0 },
		])

		this.right = new Sprite(player.position, '/static/assets/farmer_16x16.png', [
			{ x: 5, y: 0 },
			{ x: 6, y: 0 },
			{ x: 7, y: 0 },
			{ x: 8, y: 0 },
			{ x: 9, y: 0 },
		])

		this.up = new Sprite(player.position, '/static/assets/farmer_16x16.png', [
			{ x: 10, y: 0 },
			{ x: 11, y: 0 },
			{ x: 12, y: 0 },
			{ x: 13, y: 0 },
			{ x: 14, y: 0 },
		])

		this.jumping = new TriggerSprite(player.position, '/static/assets/farmer_carrying_16x16.png', [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
			{ x: 4, y: 0 },
			{ x: 5, y: 0 },
		])

		this.carrying = new Sprite(player.position, '/static/assets/farmer_carrying_16x16.png', [
			{ x: 6, y: 0 },
			{ x: 7, y: 0 },
			{ x: 8, y: 0 },
		])

		const m = 8
		const x = player.position.offset(-20, 0, 29*m, 16*m)

		this.idleWithGun = new Sprite(x, '/static/assets/farmer_shooting_29x16.png', [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
			{ x: 4, y: 0 },
			{ x: 5, y: 0 },
			{ x: 6, y: 0 },
			{ x: 7, y: 0 },
		])

		this.shooting = new Sprite(x, '/static/assets/farmer_shooting_29x16.png', [
			{ x: 7, y: 0 },
			{ x: 8, y: 0 },
			{ x: 9, y: 0 },
			{ x: 10, y: 0 },
			{ x: 11, y: 0 },
			{ x: 12, y: 0 },
			{ x: 13, y: 0 },
		])

		this.handsUp = new Sprite(player.position, '/static/assets/farmer_idle_16x16.png', [
			{ x: 1, y: 0 },
		])

		this.idle = new HorizontalSprite(player.position, '/static/assets/farmer_idle_16x16.png')
	}

	jump() {
		this.jumping.play()
	}

	draw(draw, guiDraw) {
		if (this.jumping.playing) {
			this.jumping.draw(draw, guiDraw)
		}
		else if (this.player.holding) {
			this.carrying.draw(draw, guiDraw)
		}
		// else if (super.movingUp) {
		// 	this.up.draw(draw, guiDraw)
		// }
		// else if (super.movingDown) {
		// 	this.forward.draw(draw, guiDraw)
		// }
		// else if (super.movingRight) {
		// 	this.right.draw(draw, guiDraw)
		// }
		// else if (super.movingLeft) {
		// 	this.right.mirrorDraw(draw, guiDraw)
		// }
		else {
			// this.idle.draw(draw, guiDraw)
			this.shooting.draw(draw, guiDraw)
		}
	}
}
