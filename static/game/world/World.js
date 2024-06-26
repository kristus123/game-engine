export class World {
	constructor() {

		this.player = new Player()
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.onlineObjects = new OnlineObjects(this.player)

		// const editor = ObjectPersistence.get()
		// for (const o of editor) {
		// 	// new Chicken(
		// 	if (o.constructor.name == 'Chicken') {
		// 		this.player.gun.hittableObjects.push(o)
		// 	}
		// }

		this.chickens  = new PersistedObjects('/persisted-objects/data.json')
		this.localObjects = new LocalObjects([
			new StarBackground(),
			//new Planet(new Position(0, 0)),
			this.onlineObjects,
			new OnlinePlayers(this.player, Cam),
			this.player,
			new FirstQuest(this.player),
			// new Noise(new Position(0, 0, 1000, 1000), 20),
			//new Noise(new Position(0, 0, 209, 209)),
		])

		Overlay.leftButton('edit mode', () => {
			Overlay.clearAll()
			Level.change(new WorldEditor(Cam))
		})

	}

	update() {
		this.localObjects.update()
		this.chickens.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		this.chickens.draw(draw, guiDraw)
	}

}
