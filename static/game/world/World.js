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

const image = new Image()
image.src = "/static/assets/test.png";
image.crossOrigin = "Anonymous";



let regions = []

let detector = null
image.onload = () => {
    detector = new PicturePositionExtractor(image);
    regions = detector.processImage().map(r => {
		return doScale(r)
    })
    console.log("Detected regions:", regions);
}

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
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		if (detector && detector.ib) {
		//for some reason the image is offset by 2 pixels
			draw.imageBitmap(new Position(-2,-2), detector.ib) 
		}
		for (const r of regions) {
			if (!Mouse.hovering(r)) {
				draw.rectangle(r, r.color)
			}
		}
		// draw.test(new Position(0, 0))
	}
}
