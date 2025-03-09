const scale = 15

export class PicturePositionExtractor {
    constructor(image, canvasRenderer) {
        this.canvasRenderer = canvasRenderer;
        this.colorMap = new Map();
        this.regions = [];

		this.canvasRenderer.ctx.imageSmoothingEnabled = false

		//draws it so it can be parsed by code below
        this.canvasRenderer.ctx.drawImage(image, 0,0)
    }

    extractColors() {
        const imageData = this.canvasRenderer.ctx.getImageData(0, 0, this.canvasRenderer.palette.canvas.width, this.canvasRenderer.palette.canvas.height);
        const pixels = imageData.data;

        for (let i = 0; i < pixels.length; i += 4) {
            const [r, g, b, a] = [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
            if (a === 0) continue; // Ignore transparent pixels
            const key = `${r},${g},${b}`
            if (!this.colorMap.has(key)) {
                this.colorMap.set(key, []);
            }
            this.colorMap.get(key).push(i / 4); // Store pixel index
        }
    }

detectRegions() {
    const width = this.canvasRenderer.palette.canvas.width;
    const height = this.canvasRenderer.palette.canvas.height;
    const visited = Array.from({ length: height }, () => Array(width).fill(false));

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0],  // Left, Right, Up, Down
        [-1, -1], [-1, 1], [1, -1], [1, 1] // Diagonal moves
    ];

    // Loop through each color group
    for (const [colorKey, pixelIndices] of this.colorMap) {
        let regionsForColor = [];

        // We process each pixel in the list of pixels for this color
        for (const index of pixelIndices) {
            const x = index % width;
            const y = Math.floor(index / width);

            // If the pixel has already been visited, skip it
            if (visited[y][x]) continue;

            // Perform flood fill using BFS to find connected region of the same color
            const queue = [[x, y]];
            const regionPixels = [];
            let minX = x, minY = y, maxX = x, maxY = y;

            while (queue.length > 0) {
                const [cx, cy] = queue.shift();
                if (visited[cy][cx]) continue;

                visited[cy][cx] = true;
                regionPixels.push([cx, cy]);

                // Expand bounding box
                minX = Math.min(minX, cx);
                minY = Math.min(minY, cy);
                maxX = Math.max(maxX, cx);
                maxY = Math.max(maxY, cy);

                // Check all 8 possible directions for connectivity
                for (const [dx, dy] of directions) {
                    const nx = cx + dx, ny = cy + dy;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const neighborIndex = ny * width + nx;
                        // Ensure the neighbor has the same color and has not been visited yet
                        if (!visited[ny][nx] && pixelIndices.includes(neighborIndex)) {
                            queue.push([nx, ny]);
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
                color: colorKey,
                pixels: regionPixels
            });
        }

        this.regions.push(...regionsForColor); // Add all regions for the current color

			this.canvasRenderer.ctx.imageSmoothingEnabled = false
        this.canvasRenderer.ctx.drawImage(this.image, 0,0, this.image.width*scale, this.image.height*scale)
    }
}
    processImage() {
        this.extractColors();
        this.detectRegions();
        return this.regions;
    }
}
