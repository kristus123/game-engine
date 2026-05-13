export class World {
	constructor() {
		// Page.go(PracticePage)

<<<<<<< HEAD
		this.objects = Objects([
			Sprite.world(WorldPosition(0, 0)),
			{
				update: () => {
					D1.lightSource(WorldPosition(1600, 2238))
				},
			},
			Sprite.fireplace(WorldPosition(1512, 2100)),
			this.player = Player(WorldPosition(1800, 2100)),
			Dialog([
				{text: "hey sexy boy", sleepEnd: 100},
				{text: "how are you", sleepEnd: 200},
				{text: "It is time we learn about the Sami people", sleepEnd: 100},
				{text: "Sit down, and relax", sleepEnd: 100},
				{text: "We need some berries. go pick some!", sleepEnd: 1000},
			], () => {
				console.log("wow")
			}),

		])
||||||| parent of 3a3b100d (x)
		let id = null
		Dom.add([
			Html.input("id", (value) => {
				id = value
			}),
			Html.button("Create", () => {
				SfuClient.create()
			}),
			Html.button("Join", () => {
				SfuClient.connect(id)
			}),
			Html.button("Disconnect", () => {
				SfuClient.disconnect()
			})
		])
		
	
		//F.test().domFloat({ x: 100, y: 100 })
=======
		const html = F.test
		html.domFloat({ x: 100, y: 100 })
>>>>>>> 3a3b100d (x)

<<<<<<< HEAD
		Camera.follow(this.player)
		Controller.control(this.player)
||||||| parent of 3a3b100d (x)
		//F.textBubble().domFloat({ x: 200, y: 200 })
=======
		this.viking = Sprite.viking(WorldPosition(-800, 0))
		this.player = Sprite.player(WorldPosition(200, 300))
>>>>>>> 3a3b100d (x)

<<<<<<< HEAD
||||||| parent of 3a3b100d (x)
		// const html = F.test
		// html.domFloat({ x: 100, y: 100 })

		// this.viking = Sprite.viking(WorldPosition(-800, 0))
		// this.player = Sprite.player(WorldPosition(200, 300))

		// this.world = Sprite.world(WorldPosition(0, 0))
		// this.worldTileInfo = TileInfo.world(WorldPosition(0, 0))

		// Camera.follow(this.player)
		// Controller.control(this.player)

		// RtcClient.onIncomingCall = (callerId, offer) => {
		// 	RtcClient.acceptIncomingCall(callerId, offer)
		// }

		// RtcClient.onCallAccepted = clientId => {
		// 	console.log(`Conncted With ${clientId}!`)
		// }
=======
		this.world = Sprite.world(WorldPosition(0, 0))
		this.worldTileInfo = TileInfo.world(WorldPosition(0, 0))

		Camera.follow(this.player)
		Controller.control(this.player)
>>>>>>> 3a3b100d (x)
	}

	update() {
<<<<<<< HEAD
		this.objects.update()
||||||| parent of 3a3b100d (x)
		// this.viking.update()
		// this.world.update()

		// this.player.update()

		// if (this.worldTileInfo.touches("grass", 4, Mouse.position)) {
		// 	console.log("hei")
		// }
=======
		this.viking.update()
		this.world.update()

		this.player.update()

		if (this.worldTileInfo.touches("grass", 4, Mouse.position)) {
			console.log("hei")
		}
>>>>>>> 3a3b100d (x)

		D1.text(Mouse.position, `${Mouse.position.x} ${Mouse.position.y}`)
	}
}
