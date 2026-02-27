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
		this.normalImageData = null
		if (normalData) {
			const normalCanvas = document.createElement("canvas")
			const normalCtx = normalCanvas.getContext("2d")
			normalCanvas.width = frame.width
			normalCanvas.height = frame.height
			normalCtx.drawImage(
				normalData.image,
				normalData.frame.x,
				normalData.frame.y,
				normalData.frame.width,
				normalData.frame.height,
				0,
				0,
				frame.width,
				frame.height
			)
			this.normalImageData = normalCtx.getImageData(0, 0, frame.width, frame.height)
			this.applyLighting({ x: 0.5, y: -0.5, z: 1 })
		}
	}

	applyLighting(lightDir) {
		if (!this.normalImageData) {
			return
		}
		const base = new ImageData(
			new Uint8ClampedArray(this.baseImageData.data),
			this.baseImageData.width,
			this.baseImageData.height
		)
		const data = base.data
		const normals = this.normalImageData.data
		const len = Math.sqrt(lightDir.x**2 + lightDir.y**2 + lightDir.z**2)
		const lx = lightDir.x/len, ly = lightDir.y/len, lz = lightDir.z/len
		for (let i = 0; i < data.length; i += 4) {
			const nx = normals[i] / 255 * 2 - 1
			const ny = normals[i + 1] / 255 * 2 - 1
			const nz = normals[i + 2] / 255 * 2 - 1
			const dot = Math.max(0, nx * lx + ny * ly + nz * lz)
			const light = 0.4 + 0.6 * dot
			data[i] = Math.min(255, data[i] * light)
			data[i + 1] = Math.min(255, data[i + 1] * light)
			data[i + 2] = Math.min(255, data[i + 2] * light)
		}
		this.ctx.putImageData(base, 0, 0)
	}

	draw(d, lightDir = null) {
		if (lightDir) {
			this.applyLighting(lightDir)
		}
		const dToUse = d || this.d
		dToUse.picture(this.position, this.canvas)
	}
}
