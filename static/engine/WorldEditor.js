export class WorldEditor {

	constructor(camera, mouse) {
		camera.followInstantly(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))

		this.mouseMove = new MouseMove(mouse)
		this.grid = new Grid(mouse)
		this.stuffs = new LocalObjects([
			new Controller().control(camera.objectToFollow),
			new StarBackground(camera),
			// new Planet(0, 0),
			this.grid,
			this.mouseMove,
		])


		this.worldObjects = new LocalObjects()

		ObjectPersistence.get().forEach(o => {
			this.worldObjects.add(o)
			this.mouseMove.add(o)
		})

		this.add = null
		Overlay.leftButton('game objects', () => {
			Overlay.clearBottom()

			Overlay.bottomButton('chicken', () => {
				this.add = p => new Chicken(p)
			})

		})

		Overlay.leftButton('grid', () => {
			Overlay.clearBottom()
			this.grid.show = true

			this.add = p => this.grid.add(p)

			// Overlay.bottomButton('chicken', () => {

			// 	this.add = p => new Chicken(p)
			// })

		})

		Overlay.leftButton('images', () => {
			Overlay.clearBottom()

			const images = Http.get('/picture-library')
			for (const category in images) {
				Overlay.rightButton(category, () => {

					Overlay.clearBottom()

					for (const image of images[category]) {
						Overlay.bottomImage(image, () => {
							this.add = p => new StaticPicture(p, image)
						})
					}
				})
			}
		})

		mouse.addOnClick('paint', p => {
			const o = this.add(p)
			
			this.worldObjects.add(o)
			this.mouseMove.add(o)
			ObjectPersistence.save(o)
		})
	}

	update() {
		this.worldObjects.update()
		this.stuffs.update()
	}

	draw(draw, guiDraw) {
		this.worldObjects.draw(draw, guiDraw)
		this.stuffs.draw(draw, guiDraw)
	}
}
