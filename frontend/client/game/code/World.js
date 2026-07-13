export class World {
	constructor() {
		G.player = Player(WorldPosition(950, 420))
		G.oldSami = OldSami(WorldPosition(730, 600))

		this.objects = Objects([
			Sprite.world(WorldPosition(0, 0)),

			Sprite.bush(WorldPosition(500, 400)).loopTag("berries"),
			Sprite.bush(WorldPosition(550, 800)).loopTag("berries"),
			Sprite.bush(WorldPosition(1150, 750)).loopTag("berries"),

			DemoQuest(),

			G.player,
			G.oldSami,
		])

		Controller.control(G.player)
		Camera.follow(G.player)
	}

	update() {
		this.objects.update()
	}
}
