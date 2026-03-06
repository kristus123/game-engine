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
	}

	update() {
		this.objects.update()
		G.stones.update()
		if (Mouse.down) {}

		// Test Code
		if (Keyboard.up) {
			if (this.testLobbyCreated) { return }

			this.testLobbyCreated = true

			const lobbyId = prompt("Enter LobbyID")
			Lobby.join(lobbyId)
		}

		if (Keyboard.down) {
			if (this.testLobbyJoined) { return }

			this.testLobbyJoined = true

			Lobby.create()
		}
	}
}
