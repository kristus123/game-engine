export class World {
	constructor() {
		this.objects = Objects([
			this.player = Player(WorldPosition(0, 0)),
			Sprite.snow(D3, WorldPosition(0, 0), 4)
		])

		for (const p of WorldPosition(0, 0, 500, 500).randomPoints(100, 20, 20)) {
			G.stones.add(new Stone(p))
		}

		Controller.control(this.player)
		Camera.follow(this.player)

		// Lobby Test Code
		let x = null

		const lobbyList = {}

		Dom.add([
			Html.button("Create A Lobby", () => {
				x = Lobby.create()
			}),
			Html.button("Check Lobby Object", () => {
				console.log(x)
			})
		])

		console.log(Lobby.activeLobbies)

		for (const [lobbyId, hostClientId] of Object.entries(Lobby.activeLobbies)) {
			Dom.add([
				Html.button(lobbyId, () => {
					console.log("joining...")
					x = Lobby.join(lobbyId, hostClientId)
				})
			])
		}

		setInterval(() => {
		}, 200)
		// this.player.pushTowards(Mouse.position, 100)
	}

	update() {
		this.objects.update()
		G.stones.update()
		if (Mouse.down) {}
	}
}
