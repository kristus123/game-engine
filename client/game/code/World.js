export class World {

	constructor() {
		this.player = Player(WorldPosition(2000, 2000)),
		G.player = this.player

		this.objects = Objects([
			this.fireplace = Sprite.fireplace(WorldPosition(1512, 2100)),
			this.world = Sprite.world(WorldPosition(0, 0)),
			{
				update: () => {
					// D1.lightSource(WorldPosition(1600, 2238))
				},
			},
			G.player,
			this.tree = Tree(WorldPosition(2000, 2000)),
			this.bush = Sprite.bush(WorldPosition(2000, 1500)).loopTag("berries"),
			this.oldSami = OldSami(),
			IntroQuest(this.player, this.oldSami, this.bush),
			// Light.add(WorldPosition(1600, 2238), 200, "255,165,0", 0.5),
		])

		Camera.follow(this.player)
		Controller.control(this.player)

		this.fireplace.shadow()
		this.tree.sprite.shadow()
	}

	update() {
		this.objects.update()

		this.fireplace.updateShadow(this.player.position)
		this.tree.sprite.updateShadow(this.player.position)

		D2.circle(WorldPosition(2000, 2000), 50)
	}

}
