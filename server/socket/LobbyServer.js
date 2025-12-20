// dont use clientList, use clients instead when naming fields and variables


// remove all logic related to only having the admin be allowed to do stuff
// it is not important at the momment

module.exports = class {
	constructor(socketServer) {
		this.lobbies = {}

		
		this.socketServer.on("CREATE_LOBBY", (client, clientId, data) => {
			console.log(`> ${clientId} Is Creating A Lobby...`)
	
			this.lobbies[data.lobbyId] = {
				adminClientId: clientId,
				clientList: [
					clientId,
				]
			}

			console.log(`> New Lobby Appended: ${JSON.stringify(this.lobbies)}`)

			this.socketServer.sendToClient(client, {
				action: "NEW_LOBBY", // why do this ?
				clients: this.lobbies[data.lobbyId].clientList
			})
		})

		this.socketServer.on("JOIN_LOBBY", (client, clientId, data) => {
			console.log(`> ${clientId} Is Joining Lobby ${data.lobbyId}`)
			
			if(!this.lobbies[data.lobbyId]){
				console.log(`> Could Not Join Lobby ${data.lobbyId} It Does Not Exist!`)
				return // don't use return like this. use if-else instead
			}
			
			const clientList = this.lobbies[data.lobbyId].clientList

			console.log(`> New Client Appended To Lobby ${data.lobbyId}: [${this.lobbies[data.lobbyId].clientList}]`)
			
			clientList.forEach((targetClientId, index) => {
				this.socketServer.sendToEveryone({
					action: "CLIENT_JOINS_LOBBY",
					originLobbyId: data.lobbyId,
					targetClientId: targetClientId,
					clientId: clientId
				})
			})
			
			clientList.push(clientId)
			
			this.socketServer.sendToClient(client, {
				action: "NEW_LOBBY",
				clients: this.lobbies[data.lobbyId].clientList
			})
		})

		this.socketServer.on("LEAVE_LOBBY", (client, clientId, data) => {
			const lobbyId = data.lobbyId
			console.log(`> ${clientId} Is Leaving Lobby ${lobbyId}`)
			this.handle_disconnect(lobbyId, clientId)
		})

		this.socketServer.on("CLOSE_LOBBY", (client, clientId, data) => {
			console.log(`> Closing Lobby ${data.lobbyId}`)
			
			const lobbyId = data.lobbyId
			
			if(!this.lobbies[lobbyId]){
				console.log(`> Could Not Close Lobby ${lobbyId} It Does Not Exist!`)
				return
			}

			// Close Only If The Requesting Client Is The Admin
			if(clientId === this.lobbies[lobbyId].adminClientId){
				const clientList = this.lobbies[lobbyId].clientList
	
				clientList.forEach((clientId, index) => {
					this.socketServer.sendToEveryone({
						action: "LOBBY_CLOSED",
						originLobbyId: lobbyId,
						targetClientId: clientId,
					})
				})
	
				delete this.lobbies[lobbyId]
			
				console.log(`> Closed Lobby ${lobbyId}`)			
			} else {
				console.log(`> Lobby Close Request On Lobby ${lobbyId} By Client ${clientId} Was Rejected Due To No Admin Access`)
			}

		})

		this.socketServer.onClose = (client, clientId) => {
			Object.keys(this.lobbies).forEach((lobbyId) => {
				const clientList = this.lobbies[lobbyId].clientList
				if (clientList.includes(clientId)) {
					console.log(`> ${clientId} Is Left Lobby ${lobbyId} Unexpectedly`)
					this.handle_disconnect(lobbyId, clientId)
				}
			})
		}

	}
	
	// This is a function because it is used by more than one action
	handle_disconnect(lobbyId, clientId) {	
		if(!this.lobbies[lobbyId]){
			console.log(`> Could Not Leave Lobby ${lobbyId} It Does Not Exist!`)
			return
		}
			
		const clientList = this.lobbies[lobbyId].clientList

		const clientIndex = clientList.indexOf(clientId)
		clientList.splice(clientIndex, 1)
			
		if(clientList.length < 1) {
			console.log(`> Lobby ${lobbyId} Was Removed Due To No Connected Players`)
			delete this.lobbies[lobbyId]
			return
		}

		// If The Admin Is Leaving Then Transfer Lobby Ownership
		if(clientId === this.lobbies[lobbyId].adminClientId){
			const randomIndex = Math.floor(Math.random() * clientList.length)
			this.lobbies[lobbyId].adminClientId = clientList[randomIndex]
			console.log(`> Ownership of Lobby ${lobbyId} was transfered to Client ${this.lobbies[lobbyId].adminClientId}`)
		}
		
		this.lobbies[lobbyId].clientList = clientList

		console.log(`> Client ${clientId} Was Removed From Lobby ${lobbyId}: [${this.lobbies[lobbyId].clientList}]`)

		clientList.forEach((targetClientId, index) => {
			this.socketServer.sendToEveryone({
				action: "CLIENT_LEFT_LOBBY",
				originLobbyId: lobbyId,
				targetClientId: targetClientId,
				clientId: clientId
			})
		})

	}
}
