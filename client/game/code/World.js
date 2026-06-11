export class World {

	constructor() {
		ClientToken.create(() => {
			console.log(ClientToken.get().internal)
		})

		// const test = Dom.add(Html.test())

		// let placeholder = null

		// Dom.onDrag = e => {
		// 	test.list.forEach(c => {
		// 		c.addClass("blue")
		// 	})
		// }

		// Dom.onDrop = e => {
		// 	test.list.forEach(c => {
		// 		c.removeClass("blue")
		// 	})
		// }

		// Dom.whileDragging = e => {

		// 	const nextItem = test.list.children.find(i => {
		// 		const r = i.getBoundingClientRect()
		// 		return Mouse.screen.y < r.top + r.height / 2
		// 	})

		// 	if (nextItem) {
		// 		test.list.insertBefore(e, nextItem)
		// 	}
		// 	else {
		// 		test.list.appendChild(e)
		// 	}
		// }

		// test.list.onDragChild({
		// 	onDrag: (e) => {
		// 		console.log(e)
		// 	},
		// 	onDrop: (e) => {
		// 		console.log(e)
		// 	},
		// 	whileDragging: () => {

		// 	},
		// })

		this.player = Player(WorldPosition(2000, 2000)),
			G.player = this.player

		Internet.onOnline(() => {
			console.log("Server connection restored")
		})

		Internet.onOffline(() => {
			console.log("Server connection lost")
		})

		this.objects = Objects([
			this.fireplace = Sprite.fireplace(WorldPosition(1512, 2100)),
			this.world = Sprite.world(WorldPosition(0, 0)),
			{
				update: () => {
					// D1.lightSource(WorldPosition(1600, 2238))
				},
			},
			G.player,
			...Iterate(200, () => {
				return Tree(Random.direction(WorldPosition(2000, 2000), 4000))
			}),
			this.bush = Sprite.bush(WorldPosition(2000, 1500)).loopTag("berries"),
			this.oldSami = OldSami(),
			RandomIntegerEveryMs(0, 100, 5000, (v) => {
				console.log(v)
			}),
			Every(2000, () => {
				console.log("fireplace inside view:", Camera.insideView(this.fireplace))
			}),
			IntroQuest(this.player, this.oldSami, this.bush),
			// Light.add(WorldPosition(1600, 2238), 200, "255,165,0", 0.5),
		])

		Camera.follow(this.player)
		Controller.control(this.player)

		this.fireplace.shake(20, 10)

		console.log(this.fireplace)
	}

	update() {
		this.objects.update()


		G.player.enforceCollision(this.fireplace)

		D1.box(this.fireplace.position)

		D2.circle(WorldPosition(2000, 2000), 50)


	}

}
