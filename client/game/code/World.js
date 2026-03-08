export class World {
	constructor() {
		this.testLobbyCreated = false
		this.testLobbyJoined = false

		this.objects = Objects([
			this.player = Player(WorldPosition(0, 0)),
			Sprite.snow(D3, WorldPosition(0, 0), 4)
		])

		for (const p of WorldPosition(0, 0, 500, 500).randomPoints(100, 20, 20)) {
			G.stones.add(new Stone(p))
		}

		Controller.control(this.player)
		Camera.follow(this.player)

		setInterval(() => {
		}, 200)
		// this.player.pushTowards(Mouse.position, 100)

		let x = null

		Dom.add([
			Html.button("Create A Lobby", () => {
				x = Lobby.create()
			}),
			Html.input("Join LobbyId", value => {
				x = Lobby.join(value)
			}),
			Html.button("Check Lobby Object", () => {
				console.log(x.lobbyId)
				console.log(x.clients)
			})
		])
	}

	update() {
		this.objects.update()
		G.stones.update()
		if (Mouse.down) {}
	}
}
