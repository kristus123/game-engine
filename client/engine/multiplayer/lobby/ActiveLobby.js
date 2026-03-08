export class ActiveLobby {
	constructor(lobbyId, adminId = "") {
    	this.lobbyId = lobbyId
    	this.adminId = adminId
    	this.clients = []

    	this.actionListener = ActionListener()

    	this.actionListener.listen("SYNC_LOBBY", data => {
        	console.log(data)

        	if (data.lobbyId === this.lobbyId) {
            	this.adminId = data.adminId
            	this.clients = data.clients
            	console.log(`Synchronized Lobby Client List: ${this.lobbyId}`)
        	}
    	})

		WebSocketWrapper.onMessage = data => {
			this.actionListener.trigger(data.action, data)
		}
	}

	leave() {
    	this.lobbyId = ""
    	this.adminId = ""
    	this.clients = []

    	WebSocketWrapper.send({
        	action: "LEAVE_LOBBY",
        	id: lobbyId,
    	})
	}
}