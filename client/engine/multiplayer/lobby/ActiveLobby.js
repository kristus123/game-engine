// ClientId(

export class ActiveLobby {
	constructor(lobbyId, hostClientId) {
		this.lobbyId = lobbyId
		this.hostClientId = hostClientId
		this.clients = []

		SocketClient.onClientMessage("JOIN_LOBBY", data => {
			if (this.lobbyId === data.lobbyId) {
				this.clients.push(data.originClientId)

				for (const clientId of this.clients) {
					SocketClient.sendToClient("SYNC_LOBBY_CLIENT_LIST", clientId, {
						lobbyId: this.lobbyId,
						clients: this.clients
					})
				}

				SocketClient.sendToClient("JOINED_LOBBY", data.originClientId, {
					clients: this.clients
				})
			}
		})

		SocketClient.onClientMessage("SYNC_LOBBY_CLIENT_LIST", data => {
			if (data.lobbyId === this.lobbyId) {
				this.clients = data.clients
			}
		})
	}

	leave() {
		const index = this.clients.indexOf(ClientId)
		this.clients.splice(index, 1)

		for (const clientId of this.clients) {
			SocketClient.sendToClient("SYNC_LOBBY_CLIENT_LIST", clientId, {
				lobbyId: this.lobbyId,
				clients: this.clients
			})
		}

		this.lobbyId = ""
		this.hostClientId = ""
		this.clients = []
	}
}
