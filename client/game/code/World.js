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
			IntroQuest(this.player, this.oldSami, this.bush),
			// Light.add(WorldPosition(1600, 2238), 200, "255,165,0", 0.5),
		])

		Camera.follow(this.player)

		this.cameraViewTest = Dom.add(H.p("FIREPLACE IN VIEW: ..."))
		this.cameraViewTest.style.position = "fixed"
		this.cameraViewTest.style.left = "20px"
		this.cameraViewTest.style.top = "20px"
		this.cameraViewTest.style.zIndex = "1000"
		this.cameraViewTest.style.padding = "8px"
		this.cameraViewTest.style.backgroundColor = "black"
		this.cameraViewTest.style.pointerEvents = "none"

		Controller.control(this.player)

		this.fireplace.shake(20, 10)
	}

	update() {
		this.objects.update()

		const fireplaceInsideView = Camera.insideView(this.fireplace)
		H.changeText(
			this.cameraViewTest,
			`FIREPLACE IN VIEW: ${fireplaceInsideView ? "YES" : "NO"}`
		)
		this.cameraViewTest.style.color = fireplaceInsideView ? "lime" : "red"

		this.fireplace.flicker(0.5, 255, 0, 0)
		this.fireplace.reset()

		D2.circle(WorldPosition(2000, 2000), 50)

		//D1.box(Camera.visiblePosition)
	}

}
