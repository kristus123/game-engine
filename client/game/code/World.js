export class World {
	constructor() {
//		Page.go(LandingPage)

		let x = null
		Dom.add([
			Html.button("New Lobby", () => {
				x = Lobby.create()
				console.log(x)
			}),
		])

		Lobby.onNewLobby(lobby => {
			if (lobby.hostClientId != ClientId) {
				Dom.add([
					Html.button(lobby.lobbyId, () => {
						x = Lobby.join(lobby.lobbyId)
						console.log(x)
					})
				])
			}
		})

		
		
	}

	update() {
	}
}
