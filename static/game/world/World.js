export class World {
	constructor() {

		const player = new Player(new Position(400, 400))
		this.player = player
		Controller.control(player)
		G.player = player
		Camera.follow(this.player)

		const storeWorker = new Npc(new Position(0, 0, 13, 22))
		G.storeWorker = storeWorker

		const palette = Palette.fixedOffscreen(1080, 720)
		palette.drawImage(G.pictures.world(new Position(0,0, 1080*5, 720*5)).image)
		palette.tintBlue()
		palette.toImageBitmap(ib => {
			this.ib = ib
		})

		this.localObjects = new LocalObjects([
			storeWorker,
			new KillingMachine(new Position(100, 100, 20, 20)),
			player,
			...Iterate(10, () => new Chicken(new Position(200, 0))),
			new DeliverBoxQuest(),

			new Dialogue([
				new TextTyper(G.player, 'hei'),
				new TextTyper(G.storeWorker, 'hei'),
				new TextTyper(G.storeWorker, 'knulla mig?'),
				new TextTyper(G.player, 'ja kjerring'),
			]),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		if (this.ib) {
			draw.imageBitmap(new Position(-2, -2), this.ib)
		}

		this.localObjects.draw(draw, guiDraw)

	}
}
