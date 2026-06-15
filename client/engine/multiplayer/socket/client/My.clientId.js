let clientId = localStorage.getItem("clientId")

if (clientId == null) {
	clientId = Random.uuid()
	localStorage.setItem("clientId", clientId)
}

export const My.clientId = clientId
console.log(My.clientId)
