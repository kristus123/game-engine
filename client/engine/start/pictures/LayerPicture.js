export class LayerPicture extends Picture {
	constructor(d, position, image, frame, normalData = null) {
		super(position, image)
		super.clear()
		this.canvas.width = frame.width
		this.canvas.height = frame.height
		this.ctx = this.canvas.getContext("2d")
		this.ctx.drawImage(image, frame.x, frame.y, frame.width, frame.height, 0, 0, frame.width, frame.height)
		if (normalData) {
			this.setNormalMap(normalData, frame)
		}
	}

	draw(d, lightDir = null) {
		if (lightDir) {
			this.applyLighting(lightDir)
		}
		const dToUse = d || this.d
		dToUse.picture(this.position, this.canvas)
	}
}
