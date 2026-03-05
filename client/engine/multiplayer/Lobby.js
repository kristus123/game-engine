export class Lobby {
    static create() {
        return {
            id: Random.uuid(),
            adminClientId: "",
            clients: []
        }
    }

    static join(lobbyId) {
        return {
            id: lobbyId,
            adminClientId: "",
            clients: []
        }
    }

    static leave() {
        console.log("leave")
    }
}