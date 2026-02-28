export class NormalMap {
	constructor(image, frame, width, height) {
		const canvas = document.createElement("canvas")
		const ctx = canvas.getContext("2d")
		canvas.width = width
		canvas.height = height
		ctx.drawImage(
			image,
			frame.x,
			frame.y,
			frame.width,
			frame.height,
			0,
			0,
			width,
			height
		)
		this.imageData = ctx.getImageData(0, 0, width, height)
	}

	apply(baseImageData, lightDir, ctx) {
		const base = new ImageData(
			new Uint8ClampedArray(baseImageData.data),
			baseImageData.width,
			baseImageData.height
		)
		const data = base.data
		const normals = this.imageData.data
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
		ctx.putImageData(base, 0, 0)
	}
}
