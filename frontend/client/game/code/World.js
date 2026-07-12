export class World {
	constructor() {
		G.player = Player(WorldPosition(950, 420))
		G.oldSami = OldSami(WorldPosition(730, 600))

		this.bushes = [
			Sprite.bush(WorldPosition(500, 400)),
			Sprite.bush(WorldPosition(550, 800)),
			Sprite.bush(WorldPosition(1150, 750)),
		]

		this.bushes.forEach(b => {
			b.loopTag("berries")
		})

		this.objects = Objects([
			Sprite.world(WorldPosition(0, 0)),
			G.player,
			G.oldSami,
			Sprite.fireplace(WorldPosition(850, 580)),
			...this.bushes,
			DemoQuest(),
		])

		Controller.control(G.player)
		Camera.follow(G.player)
	}

	update() {
		this.objects.update()
	}
}
