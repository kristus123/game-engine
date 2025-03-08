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
    constructor(imageElement, canvasRenderer) {
        this.image = imageElement;
        this.canvasRenderer = canvasRenderer;
        this.ctx = this.canvasRenderer.ctx;
        this.colorMap = new Map();
        this.regions = [];

        this.canvasRenderer.ctx.drawImage(this.image, 0, 0);
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

        for (const [colorKey, pixelIndices] of this.colorMap) {
            for (const index of pixelIndices) {
                const x = index % width;
                const y = Math.floor(index / width);
                if (visited[y][x]) continue;

                // Perform flood fill using BFS
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

                    // Check all 8 possible directions
                    for (const [dx, dy] of directions) {
                        const nx = cx + dx, ny = cy + dy;
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            const neighborIndex = ny * width + nx;
                            if (!visited[ny][nx] && this.colorMap.get(colorKey).includes(neighborIndex)) {
                                queue.push([nx, ny]);
                            }
                        }
                    }
                }

                this.regions.push({
                    x: minX,
                    y: minY,
                    width: maxX - minX + 1,
                    height: maxY - minY + 1,
                    color: colorKey,
                    pixels: regionPixels // Store exact pixels for more accurate shape info
                });
            }
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

let regions = []

img.onload = () => {
    const canvasRenderer = new CanvasRenderer(img.width, img.height);
    const detector = new ImageColorDetector(img, canvasRenderer);
    regions = detector.processImage().map(r => {
		return doScale(r)
    })
    console.log("Detected regions:", regions);
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
			r.x -= 0.1
			draw.rectangle(r, r.color)
		}
		// draw.test(new Position(0, 0))
	}
}
