module.exports = class {
	constructor(socket_server) {
		this.socket = socket_server
		this.lobbyList = {}

		this.socket.on("CREATE_LOBBY", (client, clientId, data) => {
			console.log(`> ${clientId} Is Creating A Lobby...`)
			
			const lobbyId = crypto.randomUUID()
	
			this.lobbyList[lobbyId] = {
				adminClientId: clientId,
				clientList: [
					clientId,
				]
			}

			console.log(`> New Lobby Appended: ${JSON.stringify(this.lobbyList)}`)

			this.socket.sendToClient(client, {
				action: "NEW_LOBBY",
				json: {
					admin: clientId,
					lobbyId: lobbyId,
					clientList: this.lobbyList[lobbyId].clientList
				}
			})
		})

		this.socket.on("JOIN_LOBBY", (client, clientId, data) => {
			console.log(`> ${clientId} Is Joining Lobby ${data.json['lobbyId']}`)
			
			const lobbyId = data.json['lobbyId']
			const clientList = this.lobbyList[lobbyId].clientList
			clientList.push(clientId)
	
			console.log(`> New Client Appended To Lobby ${lobbyId}: ${this.lobbyList[lobbyId].clientList}`)
			
			this.socket.sendToClient(client, {
				action: "UPDATE_LOBBY_CLIENT_LIST",
				originLobbyId: lobbyId,
				json: this.lobbyList[lobbyId].clientList
			})	
		})

		this.socket.on("LEAVE_LOBBY", (client, clientId, data) => {
			console.log(`> ${clientId} Is Leaving Lobby ${data.json['lobbyId']}`)
			
			const lobbyId = data.json['lobbyId']
			const clientList = this.lobbyList[lobbyId].clientList
	
			const clientIndex = clientList.indexOf(clientId)
			const new_client_list = clientList.splice(clientIndex, 1)

			// If The Admin Is Leaving Then Transfer Lobby Ownership
			if(clientId === this.lobbyList[lobbyId].adminClientId){
				const randomIndex = Math.floor(Math.random() * new_client_list.length)
				this.lobbyList[lobbyId].adminClientId = new_client_list[randomIndex]
				console.log(`> Ownership of Lobby ${lobbyId} was transfered to Client ${this.lobbyList[lobbyId].adminClientId}`)
			}
			
			this.lobbyList[lobbyId].clientList = new_client_list

			console.log(`> Client Removed From Lobby ${lobbyId}: ${this.lobbyList[lobbyId].clientList}`)
			
			new_client_list.forEach((clientId, index) => {
				this.socket.sendToClient(client, {
					action: "UPDATE_LOBBY_CLIENT_LIST",
					originLobbyId: lobbyId,
					json: this.lobbyList[lobbyId].clientList
				})
			})
		})

		this.socket.on("CLOSE_LOBBY", (client, clientId, data) => {
			console.log(`> Closing Lobby ${data.json['lobbyId']}`)
			
			const lobbyId = data.json['lobbyId']

			// Close Only If The Requesting Client Is The Admin
			if(clientId === this.lobbyList[lobbyId].adminClientId){
				const clientList = this.lobbyList[lobbyId].clientList
	
				clientList.forEach((clientId, index) => {
					this.socket.sendToClient(client, {
						action: "LOBBY_CLOSED",
						originLobbyId: lobbyId,
						json: {}
					})
				})
	
				delete this.lobbyList[lobbyId]
			
				console.log(`> Closed Lobby ${lobbyId}`)			
			} else {
				console.log(`> Lobby Close Request On Lobby ${lobbyId} By Client ${clientId} Was Rejected Due To No Admin Access`)
			}

		})
	}
}
