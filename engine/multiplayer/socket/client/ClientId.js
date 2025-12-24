let clientId = localStorage.getItem('clientId')

if (clientId === null) {
	clientId = Random.uuid()
	localStorage.setItem('clientId', clientId)
}

export const ClientId = clientId
console.log(ClientId)
