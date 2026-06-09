export class World {

	constructor() {
		const t = Html.test()

		Dom.add(t)

		t.list.onDragChild({
			onDrag: (e) => {
				console.log(e)

			},
			onDrop: (e) => {
				console.log(e)

			},
			whileDragging: () => {

			},
		})

		// this.player = Player(WorldPosition(2000, 2000)),
		// G.player = this.player

		// this.objects = Objects([
		// 	this.fireplace = Sprite.fireplace(WorldPosition(1512, 2100)),
		// 	this.world = Sprite.world(WorldPosition(0, 0)),
		// 	{
		// 		update: () => {
		// 			// D1.lightSource(WorldPosition(1600, 2238))
		// 		},
		// 	},
		// 	G.player,
		// 	...Iterate(200, () => {
		// 		return Tree(Random.direction(WorldPosition(2000, 2000), 4000))
		// 	}),
		// 	this.bush = Sprite.bush(WorldPosition(2000, 1500)).loopTag("berries"),
		// 	this.oldSami = OldSami(),
		// 	IntroQuest(this.player, this.oldSami, this.bush),
		// 	// Light.add(WorldPosition(1600, 2238), 200, "255,165,0", 0.5),
		// ])

		// Camera.follow(this.player)
		// Controller.control(this.player)

		// this.fireplace.shake(20, 10)
	}

	update() {
		// this.objects.update()

		// this.fireplace.flicker(0.5, 255, 0, 0)
		// this.fireplace.reset()

		// D2.circle(WorldPosition(2000, 2000), 50)
	}

}
