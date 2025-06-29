export class World {
	constructor() {

		const player = new Player(new Position(400, 400))
		this.player = player
		Controller.control(player)
		G.player = player
		Camera.follow(this.player)

		const storeWorker = new Npc(new Position(0, 0, 13, 22))
		G.storeWorker = storeWorker

		this.x = G.sprites.world(new Position(200,0, 1080, 720))

		this.localObjects = new LocalObjects([
			this.x,
			storeWorker,
			new KillingMachine(new Position(100, 100, 20, 20)),
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

		for (const s of this.x.slices()) {
				draw.rectangle(s.position)
		}
	}
}
