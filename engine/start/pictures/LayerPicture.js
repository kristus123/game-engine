export class LayerPicture extends Picture {
	constructor(d, position, image, frame) {
		super(position, image)

		super.clear()

		this.ctx.drawImage(
			image,
			frame.x,
			frame.y,
			frame.width,
			frame.height,
			0,
			0,
			frame.width,
			frame.height
		)
	}

	draw(d = false) {
		const xxx = d ? d : this.d
		const x = Scale.value*7
		xxx.picture(
			Position(0, 0, this.canvas.width*x, this.canvas.height*x),
			this.canvas)
	}
}
