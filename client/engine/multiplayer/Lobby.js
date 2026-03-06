// ClientId(

export class Lobby {
    static {
        this.currentLobbyId = ""
        this.currentLobbyAdminId = ""
        this.clients = []
        this.isConnected = false

        this.actionListener = ActionListener()

        this.actionListener.listen("CREATED_LOBBY", data => {
            if (data.targetClientId === ClientId) {
                console.log(data)

                this.currentLobbyId = data.lobbyId
                this.currentLobbyAdminId = data.adminId
                this.clients = data.clients

                this.isConnected = true

                console.log(`Created Lobby: ${this.currentLobbyId}`)
            }
        })

        this.actionListener.listen("SYNC_LOBBY_CLIENT_LIST", data => {
            if (this.isConnected) {
                console.log(data)

                this.currentLobbyId = data.lobbyId
                this.currentLobbyAdminId = data.adminId
                this.clients = data.clients

                console.log(`Synchronized Lobby Client List: ${this.currentLobbyId}`)
            }
        })

		WebSocketWrapper.onMessage = data => {
			this.actionListener.trigger(data.action, data)
		}
    }

    static create() {
        console.log("creating lobby")
        
        if (!this.isConnected) {
            WebSocketWrapper.send({
                action: "CREATE_LOBBY",
            })
        }
    }

    static join(lobbyId) {
        if (!this.isConnected) {
            this.isConnected = true

            WebSocketWrapper({
                action: "JOIN_LOBBY",
                id: lobbyId,
            })
        }
    }

    static leave() {
        if (this.isConnected) {
            this.isConnected = false
        
            this.currentLobbyId = ""
            this.currentLobbyAdminId = ""
            this.clients = ""
        
            WebSocketWrapper({
                action: "LEAVE_LOBBY",
                id: lobbyId,
            })
        }
    }
}