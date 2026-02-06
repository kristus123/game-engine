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
		const dToUse = (d ? d : this.d)
		const trueScale = Scale.value*7

		const pos = WorldPosition(0, 0, this.canvas.width*trueScale, this.canvas.height*trueScale)

		dToUse.picture(pos, this.canvas)
	}
}
