export class World {
	constructor() {
		//Page.go(PracticePage)

		let x = null
		Dom.add([
			Html.p("Actions:"),
		 	Html.button("Create New Lobby", () => {
		 		x = Lobby.create()
				x.clients[ClientId].x = 0

				console.log(x)
			}),
			Html.button("Update Object Data", () => {
				x.clients[ClientId].x += 1
			}),
			Html.button("Check Lobby Object", () => {
				console.log(x)
			}),
			Html.p("Other Lobbies:"),
			this.x = H.div(),
		])

		Lobby.onNewLobby(lobby => {
			this.x.add([
				Html.button(lobby.lobbyId, () => {
					x = Lobby.join(lobby.lobbyId)
					x.clients[ClientId].x = 0

					console.log(x)
				})
			])
		})

		//this.p = Sprite.player(D1, WorldPosition(0, 0))
		//this.p2 = Sprite.player(D1, WorldPosition(200, 0))
	}

	update() {
		//this.p.update()
		//this.p2.update()
	}
}
