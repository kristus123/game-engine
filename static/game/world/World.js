const renderer = new CanvasRenderer()
const pos = new Position(0, 0, 10, 10)
renderer.draw.rectangle(new Position(50, 0, 1000, 1000))
renderer.renderImageBitmap()

const scale = 15
function doScale(region) {
        return {
            x: Math.round(region.x * scale),
            y: Math.round(region.y * scale),
            width: Math.round(region.width * scale),
            height: Math.round(region.height * scale),
            color: Random.color(),
        };
    }

export class ImageColorDetector {
    constructor(imageElement, canvasRenderer,position) {
        this.image = imageElement;
        this.canvasRenderer = canvasRenderer;
        this.ctx = this.canvasRenderer.ctx;
        this.colorMap = new Map();
        this.regions = [];

        this.canvasRenderer.ctx.drawImage(this.image, 0,0)
    }

    getColorKey(r, g, b) {
        return `${r},${g},${b}`;
    }

    extractColors() {
        const imageData = this.ctx.getImageData(0, 0, this.canvasRenderer.palette.canvas.width, this.canvasRenderer.palette.canvas.height);
        const pixels = imageData.data;
        const width = this.canvasRenderer.palette.canvas.width;
        const height = this.canvasRenderer.palette.canvas.height;

        for (let i = 0; i < pixels.length; i += 4) {
            const [r, g, b, a] = [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
            if (a === 0) continue; // Ignore transparent pixels
            const key = this.getColorKey(r, g, b);
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
    }
}
    processImage() {
        this.extractColors();
        this.detectRegions();
        return this.regions;
    }
}

const img = new Image();
img.src = "/static/assets/test.png";
img.crossOrigin = "Anonymous";
// img.width *= scale
// img.height *= scale

let regions = []

let canvasRenderer = null
img.onload = () => {
    canvasRenderer = new CanvasRenderer(200, 200);
    const detector = new ImageColorDetector(img, canvasRenderer, new Position(0, 0, img.width, img.height));
    regions = detector.processImage().map(r => {
		return doScale(r)
    })
    console.log("Detected regions:", regions);
	canvasRenderer.renderImageBitmap()
};





export class World {
	constructor() {

		this.localObjects = new LocalObjects([
			Init(this, {
				store: new Store(),
			}),
			G.ranches,
			G.monsters,
			G.poop,
			G.workers,
			G.splash,
			G.trees,
		])

		G.ranches.add(new Ranch(new Position(0, 0)))

		Html.addToScreen(Html.div('lower-center-ui', [
			Html.slider(),
			HtmlProgressBar.create(),
		]))

		Controller.control(Cam.objectToFollow)

		G.monsters.add(new SimpleMonster(new Position(0, 0)))

		BottomText.show('Welcome!', 2_000)

		// LoadingScreen.show()
		// QuestList.add('eat ass')
		// QuestList.show()
	}

	update() {
		for (const w of G.workers) {
			G.money -= 0.001
			G.money = Math.round(G.money * 100) / 100
		}
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		for (const r of regions) {
			if (!Mouse.hovering(r)) {
				draw.rectangle(r, r.color)
			}
		}
		if (canvasRenderer && canvasRenderer.ib) {
			draw.imageBitmap(new Position(0,0), canvasRenderer.ib)
		}
		// draw.test(new Position(0, 0))
	}
}
