export class Pixel {
	constructor(r, g, b, a = 255) {
		this.r = r
		this.g = g
		this.b = b
		this.a = a // Alpha channel, defaulting to 255 (fully opaque)
	}

	// Apply lighting based on a dot product and ambient light
	applyLighting(lightColor, dot, ambientLight) {
		this.r = Math.min(255, lightColor.r * dot + this.r * ambientLight)
		this.g = Math.min(255, lightColor.g * dot + this.g * ambientLight)
		this.b = Math.min(255, lightColor.b * dot + this.b * ambientLight)
	}

	// Method to apply the pixel data back into an image data array
	applyToImageData(data, index) {
		data[index] = this.r
		data[index + 1] = this.g
		data[index + 2] = this.b
		data[index + 3] = this.a
	}
}

