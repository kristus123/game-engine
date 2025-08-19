import { Palette } from '/static/engine/Palette.js'; 
import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Position } from '/static/engine/position/Position.js'; 

const scale = 4

// this can be used to extract areas of a picture
// it can only extract rectangles (i think)

export class PicturePositions {
	constructor(image, position) {

				AssertNotNull(image, "argument image in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.image = image; 
		this.position = position; 

		this.regions = []

		const palette = Palette.fixedOffscreen(image.width*scale, image.height*scale)
		palette.drawImage(image)

		const colorMap = new Map()
		
		for (const rgba of palette.rgba()) {
			if (rgba.a === 0) {
				continue
			}

			if (!colorMap.has(rgba.rgba)) {
				colorMap.set(rgba.rgba, [])
			}

			colorMap.get(rgba.rgba).push(rgba.i / 4) // Store pixel index
		}

		const visited = Array.from({ length: palette.height }, () => Array(palette.width).fill(false))

		const directions = [
			[0, 1],
			[1, 0],
			[0, -1],
			[-1, 0], // Left, Right, Up, Down
			[-1, -1],
			[-1, 1],
			[1, -1],
			[1, 1] // Diagonal moves
		]

		// Loop through each color group
		for (const [color, pixelIndices] of colorMap) {
			let regionsForColor = []

			for (const index of pixelIndices) {
				const x = index % palette.width
				const y = Math.floor(index / palette.width)

				// If the pixel has already been visited, skip it
				if (visited[y][x]) {
					continue
				}

				// Perform flood fill using BFS to find connected region of the same color
				const queue = [[x, y]]
				let minX = x, minY = y, maxX = x, maxY = y

				while (queue.length > 0) {
					const [cx, cy] = queue.shift()
					if (visited[cy][cx]) {
						continue
					}

					visited[cy][cx] = true

					// Expand bounding box
					minX = Math.min(minX, cx)
					minY = Math.min(minY, cy)
					maxX = Math.max(maxX, cx)
					maxY = Math.max(maxY, cy)

					// Check all 8 possible directions for connectivity
					for (const [dx, dy] of directions) {
						const nx = cx + dx, ny = cy + dy
						if (nx >= 0 && nx < palette.width && ny >= 0 && ny < palette.height) {
							const neighborIndex = ny * palette.width + nx
							// Ensure the neighbor has the same color and has not been visited yet
							if (!visited[ny][nx] && pixelIndices.includes(neighborIndex)) {
								queue.push([nx, ny])
							}
						}
					}
				}

				const xx = Math.round(minX * scale) + position.x
				const yy = Math.round(minY * scale) + position.y
				const width = Math.round((maxX - minX + 1) * scale)
				const height = Math.round((maxY - minY + 1) * scale)
				const pp = new Position(xx, yy, width, height)
				pp.color = color
				regionsForColor.push(pp)
			}

			this.regions.push(...regionsForColor)

			palette.ctx.imageSmoothingEnabled = false
			palette.ctx.drawImage(image, 0, 0, image.width*scale, image.height*scale)
		}

		// placement of execution is important
		// canvasRenderer.tintBlue()

		palette.toImageBitmap(ib => {
			this.ib = ib
		})
	}

	update() {
	}

	draw(draw, guiDraw) {
		if (this.ib) {
			draw.imageBitmap(new Position(-2, -2), this.ib)
		}

		for (const r of this.regions) {
			if (Mouse.hovering(r)) {
				console.log(r)
				draw.rectangle(r, r.color)
			}
		}
	}

}
