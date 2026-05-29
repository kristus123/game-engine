export class World {

	constructor() {
		this.player = Player(WorldPosition(2000, 2000)),
		G.player = this.player


		H.p("hei <kbd class">")

		Dom.add(Html.x())
		this.y = Html.y()
		Dom.add(this.y)

		this.objects = Objects([
			this.y,
			this.fireplace = Sprite.fireplace(WorldPosition(1512, 2100)),
			this.world = Sprite.world(WorldPosition(0, 0)),
			{
				update: () => {
					D1.lightSource(WorldPosition(1600, 2238))
				},
			},
			G.player,
			this.tree = Tree(WorldPosition(2000, 2000)),
			this.bush = Sprite.bush(WorldPosition(2000, 1500)).loopTag("berries"),
			this.oldSami = OldSami(),
			IntroQuest(this.player, this.oldSami, this.bush),
			Light.add(WorldPosition(1600, 2238), 200, "255,165,0", 0.5),
		])

		Camera.follow(this.player)
		Controller.control(this.player)

		this.y.position = Mouse.position
	}

	update() {
		this.objects.update()
		D2.circle(WorldPosition(2000, 2000), 50)

	}

}
