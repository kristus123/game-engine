class CanvasRenderer {
    constructor(width = 100, height = 100) {
        this.canvas = new OffscreenCanvas(width, height);
        this.ctx = this.canvas.getContext("2d");
        this.width = width;
        this.height = height;
    }

    drawRect(x, y, width, height, color = "blue") {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    getImageBitmap() {
        return this.canvas.convertToBlob().then(blob => createImageBitmap(blob));
    }
}
const renderer = new CanvasRenderer()


renderer.drawRect(0, 0, 100, 100)
let ib =  null
renderer.getImageBitmap().then(imageBitmap => {
	ib = imageBitmap
});








export class World {
	constructor() {

		this.localObjects = new LocalObjects([
			Init(this, {
				store: new Store(),
			}),
			// G.ranches,
			// G.monsters,
			// G.poop,
			// G.splash,
		])

		G.ranches.add(new Ranch(new Position(0,0)))

		Html.addToScreen(Html.div('lower-center-ui', [
			HtmlProgressBar.create()
		]))

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
		// draw.test(new Position(0, 0))


		if (ib) {
	draw.ctx.drawImage(ib, 0,200);
			
		}
	}
}
