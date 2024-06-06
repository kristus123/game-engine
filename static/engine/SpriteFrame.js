export class SpriteFrame {
	constructor(position, imagePath, frame) {
		this.frame = new Sprite(position, imagePath, 2, [frame])
	}

	update() {
		
	}

	draw(draw, guiDraw) {
		this.frame.draw(draw, guiDraw)
		
	}
}
