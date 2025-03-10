const scale = 2

export class PicturePositions {
	constructor(image) {
		const canvasRenderer = new CanvasRenderer(image.width*scale, image.height*scale)
		const colorMap = new Map()
		const regions = []

		canvasRenderer.ctx.imageSmoothingEnabled = false

		// draw it so it can be parsed by code below
		canvasRenderer.ctx.drawImage(image, 0, 0)

		const pixels = canvasRenderer.ctx.getImageData(
			0,
			0,
			canvasRenderer.palette.canvas.width,
			canvasRenderer.palette.canvas.height,
		).data

		for (let i = 0; i < pixels.length; i += 4) {
			const [r, g, b, a] = [
				pixels[i], 
				pixels[i + 1], 
				pixels[i + 2], 
				pixels[i + 3]
			]

			if (a === 0) {
				continue
			} // Ignore transparent pixels
			const key = `${r},${g},${b}`
			if (!colorMap.has(key)) {
				colorMap.set(key, [])
			}

			colorMap.get(key).push(i / 4) // Store pixel index
		}

		const width = canvasRenderer.palette.canvas.width
		const height = canvasRenderer.palette.canvas.height
		const visited = Array.from({ length: height }, () => Array(width).fill(false))

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

			// We process each pixel in the list of pixels for this color
			for (const index of pixelIndices) {
				const x = index % width
				const y = Math.floor(index / width)

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
						if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
							const neighborIndex = ny * width + nx
							// Ensure the neighbor has the same color and has not been visited yet
							if (!visited[ny][nx] && pixelIndices.includes(neighborIndex)) {
								queue.push([nx, ny])
							}
						}
					}
				}

				// After finishing the flood fill, store the region
				regionsForColor.push({
					x: minX,
					y: minY,
					width: maxX - minX + 1,
					height: maxY - minY + 1,
					color: color,
				})
			}

			regions.push(...regionsForColor) // Add all regions for the current color

			canvasRenderer.ctx.imageSmoothingEnabled = false
			canvasRenderer.ctx.drawImage(image, 0, 0, image.width*scale, image.height*scale)
		}

		// placement of execution is important
		// canvasRenderer.tintBlue()

		this.ib = null
		canvasRenderer.renderImageBitmap(() => {
			this.ib = canvasRenderer.ib
		})

		this.regions = regions.map(r => ({
			x: Math.round(r.x * scale),
			y: Math.round(r.y * scale),
			width: Math.round(r.width * scale),
			height: Math.round(r.height * scale),
			color: Random.color(),
		}))
	}
}
