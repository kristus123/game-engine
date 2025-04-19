export class DragonRoom {
	constructor(player) {

		this.entrance = new DynamicGameObject(new Position(200, 2037, 100, 100), 1, 1)

		const oldMan = new Npc(new Position(1177, 1247, 140, 200))
		Cam.zoom = 1.5
		Cam.follow(oldMan)

		this.localObjects = new LocalObjects([
			new Picture(new Position(0, 0, 100*20, 100*20), '/static/assets/dragon_room.png'),
			this.entrance,
			oldMan,

			new Dialogue([
				new MultiTextTyper(oldMan.position.over(), [
					'hei'
				], () => {
					Cam.follow(player)
				}),
				new MultiTextTyper(player.position.over(), [
					'hei'
				])
			]),

			D((draw, guiDraw) => {
				const sword = new Position(936, 1174)
				if (player.within(200, sword)) {
					console.log('hei')
					draw.text(sword.offset(0, -100), 'E to pick up')
				}
			}),
		])
	}

	update() {
		this.localObjects.update()

		if (this.player.within(500, this.entrance)) {
			Cam.follow(this.entrance)
		}
		else {
			// Cam.follow(this.player)
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
