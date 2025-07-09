import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Draw } from '/static/engine/core/Draw.js'; 
import { Palette } from '/static/engine/core/Palette.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 

// const renderer = new CanvasRenderer()
// const pos = new Position(0, 0, 10, 10)
// renderer.draw.rectangle(new Position(50, 0, 1000, 1000))
// renderer.renderImageBitmap()
// draw.imageBitmap(new Position(0,0), renderer.ib)


export class CanvasRenderer {
	constructor(width = 100, height = 100) {

				AssertNotNull(width, "argument width in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(height, "argument height in " + this.constructor.name + ".js should not be null")
			
		this.width = width; 
		this.height = height; 

		this.palette = Palette.fixedOffscreen(width, height)
		this.ctx = this.palette.canvas.getContext('2d')

		this.draw = new Draw(this.palette.ctx)

		this.ib = null
	}


	tintBlue(palette) {
		const ctx = palette.ctx
		const canvas = palette.canvas
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
		const data = imageData.data

		for (let i = 0; i < data.length; i += 4) {
			const alpha = data[i + 3]
			if (alpha === 0) {
				continue
			} // Skip fully transparent pixels

			// Apply blue tint (adjust values as needed)
			data[i] *= 0.1 // Red
			data[i + 1] *= 0.7 // Green
			data[i + 2] = Math.min(data[i + 2] + 50, 255) // Boost blue
		}

		ctx.putImageData(imageData, 0, 0)
	}

	renderImageBitmap(run) {
		this.palette.canvas.convertToBlob()
			.then(blob => createImageBitmap(blob))
			.then(imageBitmap => {
				this.ib = imageBitmap
				run()
			})
	}
}

