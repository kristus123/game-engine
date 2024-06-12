export class SpinningSpriteFrame {
	constructor(position, imagePath, frame) {
		this.frame = new Sprite(position, imagePath, [frame])
        this.rotate = Math.floor(Math.random()*360)
	}

	update() {

	}

	draw(draw, guiDraw) {
        this.rotate+=Math.floor(Math.random()*20+1)/100;

		this.frame.spinning_draw(draw, guiDraw,this.rotate)
	}
}
