export class World {
	constructor() {

		const player = new Player(new Position(400, 1800))
		this.player = player
		Controller.control(player)
		G.player = player
		Camera.follow(this.player)
		Camera.followInstantly(this.player)

		G.storeWorker = new Npc(new Position(0, 0))

		this.world = G.Sprite.world(new Position(-200,0))

		this.localObjects = new LocalObjects([
			this.world,
			G.storeWorker,
			player,

			new Dialogue([
				new TextTyper(G.player, 'hei'),
				new TextTyper(G.storeWorker, 'hei'),
			]),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		// for (const s of this.world.slices) {
		// 		draw.rectangle(s.position)
		// }
	}
}
