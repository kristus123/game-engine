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
		const lobbyInfo = {
			lobbyId: "",
			hostClientId: ""
		}

		Dom.add([
			Html.button("Create A Lobby", () => {
				x = Lobby.create()
			}),
			Html.input("Join LobbyId", value => {
				lobbyInfo.lobbyId = value
			}),
			Html.input("Join HostClientId", value => {
				lobbyInfo.hostClientId = value
			}),
			Html.button("Join Lobby", () => {
				x = Lobby.join(lobbyInfo.lobbyId, lobbyInfo.hostClientId)
			}),
			Html.button("Check Lobby Object", () => {
				console.log(x)
			})
		])

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
