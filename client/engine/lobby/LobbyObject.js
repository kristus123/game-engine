export class LobbyObject {
	constructor() {
		this.lobbyId = Random.uuid()
		
	}

	get myObjects() {
		const objects = []
		
		connectedObjects.forEach((key, value) => {
			if (ClientId === key) {
				objects.push(value)
			}
		});

		return objects
	}

	updateObject(clientId, object) {
		connectedObjects[clientId] = object
	}
}
