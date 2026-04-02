export class World {
	constructor() {
		// Page.go(AddCardPage)
		Dom.overlay(F.addCard)

		// let x = null
		// Dom.overlay([
		// 	Html.p("Actions:"),
		// 	Html.button("Create New Lobby", () => {
		// 		x = Lobby.create()
		// 		x.clients[ClientId].x = 0

		// 		console.log(x)
		// 	}),
		// 	Html.button("Update Object Data", () => {
		// 		x.clients[ClientId].x += 1
		// 	}),
		// 	Html.button("Check Lobby Object", () => {
		// 		console.log(x)
		// 	}),
		// 	Html.p("Other Lobbies:"),
		// 	this.x = H.div(),
		// ]).addClass("white")

		// Lobby.onNewLobby(lobby => {
		// 	this.x.add([
		// 		Html.button(lobby.lobbyId, () => {
		// 			x = Lobby.join(lobby.lobbyId)

		// 			x.clients[ClientId].x ??= 0
		// 			x.clients[ClientId].x += 1

		// 			console.log(x)
		// 		})
		// 	])
		// })

	}

	update() {
	}
}
