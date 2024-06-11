export class SpriteFrame {
	constructor(position, imagePath, frame) {
		this.frame = new Sprite(position, imagePath, [frame])
	}

	update() {

	}

	draw(draw, guiDraw) {
		this.frame.draw(draw, guiDraw)
	}
}
