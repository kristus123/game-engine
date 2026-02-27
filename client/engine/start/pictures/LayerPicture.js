export class LayerPicture extends Picture {
	constructor(d, position, image, frame, normalData = null) {
		super(position, image)
		super.clear()
		this.canvas.width = frame.width
		this.canvas.height = frame.height
		this.ctx = this.canvas.getContext("2d")
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
		this.baseImageData = this.ctx.getImageData(0, 0, frame.width, frame.height)
		this.normalMap = normalData
			? new NormalMap(normalData.image, normalData.frame, frame.width, frame.height)
			: null
		if (this.normalMap) {
			this.normalMap.apply(this.baseImageData, { x: 0.5, y: -0.5, z: 1 }, this.ctx)
		}
	}

	draw(d, lightDir = null) {
		if (lightDir && this.normalMap) {
			this.normalMap.apply(this.baseImageData, lightDir, this.ctx)
		}
		const dToUse = d || this.d
		dToUse.picture(this.position, this.canvas)
	}
}
