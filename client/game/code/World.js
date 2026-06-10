export class World {

	constructor() {
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



		setInterval(() => {
		  Tts("Ja, jeg smiler og ler nar jeg ser deg").speak("hello")
		  console.log("YOLO")
		}, 3000)

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
				console.log("internet connected:", Internet.connected)
			}),
			IntroQuest(this.player, this.oldSami, this.bush),
			// Light.add(WorldPosition(1600, 2238), 200, "255,165,0", 0.5),
		])

		Camera.follow(this.player)
		Controller.control(this.player)

		this.fireplace.shake(20, 10)
	}

	update() {
		this.objects.update()

		this.fireplace.flicker(0.5, 255, 0, 0)
		this.fireplace.reset()

		D2.circle(WorldPosition(2000, 2000), 50)

		//D1.box(Camera.visiblePosition)
	}

}
