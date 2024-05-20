export class WorldEditor {

	constructor(camera, mouse) {
		camera.followInstantly(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))

		this.localObjects = new LocalObjects([
			new Controller().control(camera.objectToFollow),
			new StarBackground(camera),
			// new Planet(0, 0),
			// new Grid(mouse),
		])

		ObjectPersistence.get().forEach(o => {
			this.localObjects.add(o)
		})


		this.add = null
		Overlay.leftButton('game objects', () => {
			HtmlUtils.removeChildElementsInId('bottom')

			Overlay.bottomButton('chicken', () => {
				this.add = new Chicken(p)
			})

		})

		Overlay.leftButton('images', () => {
			Overlay.clearBottom()

			this.selectedImage = null

			for (const category in images) {
				Overlay.rightButton(category, () => {

					Overlay.clearBottom()

					for (const image of images) {
						Overlay.bottomImage(image, () => this.add = () => {
							return 
							
						})
					}
				})
			}
		})

		mouse.addOnClick('paint', (p) => {
			const o = new Chicken(p)
			this.localObjects.add(o)
			ObjectPersistence.save(o)
		})

		KeyDown('-', () => {
			console.log('zooming out')
			camera.zoom -= 0.5
		})

		KeyDown('_', () => {
			console.log('zooming in')
			camera.zoom += 1.5
		})
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
