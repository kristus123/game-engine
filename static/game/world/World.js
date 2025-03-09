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

const img = new Image();
img.src = "/static/assets/test.png";
img.crossOrigin = "Anonymous";

let regions = []

let canvasRenderer = {ib:null}
img.onload = () => {
    canvasRenderer = new CanvasRenderer(img.width*scale, img.height*scale);
    const detector = new PicturePositionExtractor(img, canvasRenderer);
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
		if (canvasRenderer.ib) {
		//for some reason the image is offset by 2 pixels
			draw.imageBitmap(new Position(-2,-2), canvasRenderer.ib) 
		}
		for (const r of regions) {
			if (!Mouse.hovering(r)) {
				// draw.rectangle(r, r.color)
			}
		}
		// draw.test(new Position(0, 0))
	}
}
