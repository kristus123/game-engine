export class World {
	constructor() {
//		Page.go(LandingPage)

		let x = null
		Dom.add([
			Html.p("Actions:"),
			Html.button("Create New Lobby", () => {
				x = Lobby.create()
				console.log(x)
			}),
			Html.button("Update Object Data", () => {
				const object = x.clients[ClientId]
				object["objectData"]  += 1
			}),
			Html.button("Check Lobby Object", () => {
				console.log(x)
			}),
			Html.p("Other Lobbies:")
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
