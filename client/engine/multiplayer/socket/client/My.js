// we will swap to using userId from token that is generated from server.

let clientId = localStorage.getItem("clientId")

if (clientId == null) {
	clientId = Random.uuid()
	localStorage.setItem("clientId", clientId)
}

export const My = {
	clientId: clientId,
}
