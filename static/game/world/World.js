export class World {
	constructor() {

		const player = new Player(new Position(400, 400))
		this.player = player
		Controller.control(player)
		G.player = player

		this.followPlayerNoise = new Noise(new Position(-100, 0, 2000, 2000))
		Camera.follow(this.player)

		G.zones = new Position(0,0,10,10)
		Html.addToScreen(Html.div('ui left', [
			Html.button('hei'),
		]))


		const storeWorker = new Npc(new Position(0, 0, 13, 22), '/static/assets/girl_13x22.png')
		G.storeWorker = storeWorker

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
		this.localObjects.draw(draw, guiDraw)
	}
}
