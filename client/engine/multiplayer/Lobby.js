// ClientId(

export class Lobby {
    static {
        this.currentLobbyId = ""
    }

    static create() {
        Lobby.currentLobbyId = Random.uuid()

        return {
            id: Lobby.currentLobbyId,
            adminClientId: ClientId,
            clients: []
        }
    }

    static join(lobbyId) {
        Lobby.currentLobbyId = lobbyId

        return {
            id: Lobby.currentLobbyId,
            adminClientId: "",
            clients: []
        }
    }

    static leave() {
        this.currentLobbyId = ""

        console.log(`Left Lobby: ${this.currentLobbyId}`)
    }

    static sync() {
        console.log(`Syncing With Lobby: ${this.currentLobbyId}`)
    }
}