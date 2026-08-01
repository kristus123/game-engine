// we will swap to using userId from token that is generated from server.

let clientId = localStorage.getItem("clientId")

if (clientId == null) {
	clientId = Random.uuid()
	localStorage.setItem("clientId", clientId)
}

export class My {
	static clientId = clientId

	static _userId = null

	static get clientId() {
		Assert.value(clientId)
		return clientId
	}

}
