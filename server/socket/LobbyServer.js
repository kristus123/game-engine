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
			
			if(!this.lobbyList[lobbyId]){
				console.log(`> Could Not Join Lobby ${lobbyId} It Does Not Exist!`)
				return
			}
			
			const clientList = this.lobbyList[lobbyId].clientList

			clientList.push(clientId)
	
			console.log(`> New Client Appended To Lobby ${lobbyId}: [${this.lobbyList[lobbyId].clientList}]`)
			
			clientList.forEach((clientId, index) => {
				this.socket.sendToEveryone({
					action: "UPDATE_LOBBY_CLIENT_LIST",
					originLobbyId: lobbyId,
					targetClientId: clientId,
					json: this.lobbyList[lobbyId].clientList
				})
			})
		})

		this.socket.on("LEAVE_LOBBY", (client, clientId, data) => {
			const lobbyId = data.json['lobbyId']
			console.log(`> ${clientId} Is Leaving Lobby ${lobbyId}`)
			this.handle_disconnect(lobbyId, clientId)
		})

		this.socket.on("CLOSE_LOBBY", (client, clientId, data) => {
			console.log(`> Closing Lobby ${data.json['lobbyId']}`)
			
			const lobbyId = data.json['lobbyId']
			
			if(!this.lobbyList[lobbyId]){
				console.log(`> Could Not Close Lobby ${lobbyId} It Does Not Exist!`)
				return
			}

			// Close Only If The Requesting Client Is The Admin
			if(clientId === this.lobbyList[lobbyId].adminClientId){
				const clientList = this.lobbyList[lobbyId].clientList
	
				clientList.forEach((clientId, index) => {
					this.socket.sendToEveryone({
						action: "LOBBY_CLOSED",
						originLobbyId: lobbyId,
						targetClientId: clientId,
						json: {}
					})
				})
	
				delete this.lobbyList[lobbyId]
			
				console.log(`> Closed Lobby ${lobbyId}`)			
			} else {
				console.log(`> Lobby Close Request On Lobby ${lobbyId} By Client ${clientId} Was Rejected Due To No Admin Access`)
			}

		})

		this.socket.onClose = (client, clientId) => {
			Object.keys(this.lobbyList).forEach((lobbyId) => {
				const clientList = this.lobbyList[lobbyId].clientList
				if (clientList.includes(clientId)) {
					console.log(`> ${clientId} Is Left Lobby ${lobbyId} Unexpectedly`)
					this.handle_disconnect(lobbyId, clientId)
				}
			})
		}

	}
	
	// This is a function because it is used by more than one action
	handle_disconnect(lobbyId, clientId) {	
		if(!this.lobbyList[lobbyId]){
			console.log(`> Could Not Leave Lobby ${lobbyId} It Does Not Exist!`)
			return
		}
			
		const clientList = this.lobbyList[lobbyId].clientList

		const clientIndex = clientList.indexOf(clientId)
		clientList.splice(clientIndex, 1)
			
		if(clientList.length < 1) {
			console.log(`> Lobby ${lobbyId} Was Removed Due To No Connected Players`)
			delete this.lobbyList[lobbyId]
			return
		}

		// If The Admin Is Leaving Then Transfer Lobby Ownership
		if(clientId === this.lobbyList[lobbyId].adminClientId){
			const randomIndex = Math.floor(Math.random() * clientList.length)
			this.lobbyList[lobbyId].adminClientId = clientList[randomIndex]
			console.log(`> Ownership of Lobby ${lobbyId} was transfered to Client ${this.lobbyList[lobbyId].adminClientId}`)
		}
		
		this.lobbyList[lobbyId].clientList = clientList

		console.log(`> Client ${clientId} Was Removed From Lobby ${lobbyId}: [${this.lobbyList[lobbyId].clientList}]`)

		clientList.forEach((clientId, index) => {
			this.socket.sendToEveryone({
				action: "UPDATE_LOBBY_CLIENT_LIST",
				originLobbyId: lobbyId,
				targetClientId: clientId,
				json: this.lobbyList[lobbyId].clientList
			})
		})

	}
}
