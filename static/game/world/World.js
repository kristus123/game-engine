export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Cam.offset.x += 600
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			// new StarBackground(),
			new StaticPicture(new Position(-1000,-1000, 2000, 2000), '/static/assets/beach_64x64.png'),
			new FishingRod(this.player),
			// new PersistedObjects('/persisted-objects/chickens.json'),
			// new PersistedObjects('/persisted-objects/floors.json'),
			// new HeightMap(this.player, 20),
			this.player,
			// new FirstQuest(this.player),
		])

		Overlay.leftButton('edit mode', () => {
			Overlay.clearAll()
			Level.change(new WorldEditor(Cam))
		})

		Overlay.leftTextField('hei', text => {
			console.log(text)
		})
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		draw.position(this.player)
		this.localObjects.draw(draw, guiDraw)
	}

}
