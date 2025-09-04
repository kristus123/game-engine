import { Picture } from '/static/engine/Picture.js'; 
import { Pixel } from '/static/engine/Pixel.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/assertions/a.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Palette } from '/static/engine/palette/Palette.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class NormalMapPicture {
	constructor(position, normalMapPath) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(normalMapPath, "argument normalMapPath in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.normalMapPath = normalMapPath; 

		this.position = position

		this.position.width = 200
		this.position.height = 200

		// Load the normal map
		this.normalMap = new Image()
		this.normalMap.src = normalMapPath

		// Lighting parameters
		this.lightPosition = new Position(0, 0)
		this.lightColor = { r: 255, g: 2, b: 100 }
		this.ambientLight = 0.4 // Increased ambient light for visibility

		this.picture = new Picture(this.position, '/static/assets/box.png')
	}

	draw(draw) {
		this.lightPosition.x = Mouse.position.x
		this.lightPosition.y = Mouse.position.y
		draw.circle(this.lightPosition)


		this.picture.draw(draw)

		if (this.normalMap.complete) {

			const ox = (-Camera.position.x + (Palette.width/2))
			const oy = (-Camera.position.y + (Palette.height/2))

			const normalData = draw.ctx.getImageData(this.position.x + ox, this.position.y + oy, this.position.width, this.position.height)

			const imageData = draw.ctx.getImageData(this.position.x + ox, this.position.y + oy, this.position.width, this.position.height)
			this.applyLighting(imageData, normalData)

			draw.ctx.putImageData(imageData, this.position.x + ox, this.position.y + oy)
		}
	}

	applyLighting(imageData, normalData) {
		const data = imageData.data
		const normal = normalData.data
		const lightX = this.lightPosition.x - this.position.x
		const lightY = this.lightPosition.y - this.position.y

		const width = imageData.width
		const height = imageData.height

		for (let i = 0; i < data.length; i += 4) {
			const x = (i / 4) % width
			const y = Math.floor((i / 4) / width)

			// Inverted Y-axis for normal map data
			const ny = height - 1 - y // Flip Y-axis

			// Get normal map values
			const nx = normal[(ny * width + x) * 4] / 255 * 2 - 1
			const nyNormal = normal[(ny * width + x) * 4 + 1] / 255 * 2 - 1
			const nz = normal[(ny * width + x) * 4 + 2] / 255 * 2 - 1

			// Compute light direction
			const lx = lightX - x
			const ly = lightY - y
			const lz = 100 // Example light source height
			const length = Math.sqrt(lx * lx + ly * ly + lz * lz)
			const ld = { x: lx / length, y: ly / length, z: lz / length }

			// Dot product of normal and light direction
			const dot = Math.max(0, nx * ld.x + nyNormal * ld.y + nz * ld.z)

			// Create a Pixel instance and apply lighting
			const pixel = new Pixel(data[i], data[i + 1], data[i + 2], data[i + 3])
			pixel.applyLighting(this.lightColor, dot, this.ambientLight)

			// Apply the pixel data back to the image data
			pixel.applyToImageData(data, i)
		}
	}


}

