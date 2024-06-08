export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))

		const mouseMove = new MouseMove()
		this.worldObjects = new LocalObjects()

		ObjectPersistence.get().forEach(o => {
			this.worldObjects.add(o)
			mouseMove.add(o)
		})

		this.add = null

		Overlay.leftButton('game objects', () => {
			Overlay.clearBottom()

			Overlay.bottomButton('chicken', () => {
				this.add = p => new Chicken(p)
			})
		})

		const grid = new Grid()
		Overlay.leftButton('grid', () => {
			Overlay.clearBottom()
			grid.show = true

			this.add = p => grid.add(p)
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

		mouseMove.moved = o => {
			ObjectPersistence.update(o)
		}

		Mouse.addOnClick('paint', p => {
			if (this.add) {
				p.width = 100
				p.height = 100

				const o = this.add(p)

				this.worldObjects.add(o)
				mouseMove.add(o)
				ObjectPersistence.save(o)
			}
		})

		this.localObjects = new LocalObjects([
			Controller.control(Cam.objectToFollow),
			new StarBackground(),
			//new Planet(new Position(0, 0)),
			grid,
			mouseMove,
		])
	}

	update() {
		this.worldObjects.update()
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.worldObjects.draw(draw, guiDraw)
		this.localObjects.draw(draw, guiDraw)
	}
}
