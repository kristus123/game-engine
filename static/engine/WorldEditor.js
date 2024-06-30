export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))

		Overlay.leftButton('exit edit mode', () => {
			Overlay.clearAll()
			Level.change(new World())
		})

		this.localObjects = new LocalObjects([
			Controller.control(Cam.objectToFollow),
			new PersistedObjectsEditor([
			{ 
				filePath: '/persisted-objects/chickens.json', 
				create: p => new Chicken(p),
			},
			{ 
				filePath: '/persisted-objects/floors.json', 
				create: p => {
					p.width = 128
					p.height = 128
					return new StaticPicture(p, '/static/assets/floors/wooden_floor_128x128.png')
				},
			},
		]),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
