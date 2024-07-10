export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.fishingRod = new FishingRod(this.player)

		this.localObjects = new LocalObjects([
			// new StarBackground(),
			// new PersistedObjects('/persisted-objects/chickens.json'),
			// new PersistedObjects('/persisted-objects/floors.json'),
			// new Noise(new Position(0,0, 1000, 1000), 10),
			// this.fishingRod,
			// new HeightMap(this.player, 20),
			this.player,
			new Boat(new Position(0, 0), this.player,)
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
		this.localObjects.draw(draw, guiDraw)
		if (this.fishingRod.fishingRod) {
			draw.curve(this.player, new Position(-20, 20), new Position(-20, 20), this.fishingRod.fishingRod)
		}
	}

}
