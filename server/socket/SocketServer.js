const SocketServer = require('./SimplifiedSocketServerAPI')

const port = 8082
const socket = new SocketServer(port)

console.log(`Socket Server Listening On Port ${port}`)

socket.onConnection = (client, clientId) => {
	console.log(`${clientId} has connected`)

	socket.sendToEveryone({
		action: 'UPDATE_CLIENTS_LIST',
		clientIds: socket.allClientIds
	})
}

socket.on('CLIENT_TO_CLIENT', (client, clientId, data) => {
	console.log(`Server Passing Message: ${JSON.stringify(data)}`)

	const msgData = data.json

	const index = socket.allClientIds.indexOf(msgData.targetClientId)
	const targetClient = socket.allClients[index]

	socket.sendToClient(targetClient, data)
})

socket.onClose = (client, clientId) => {
	console.log(`${clientId} has disconnected`)

	socket.sendToEveryone({
		action: 'REMOVE_CLIENT',
		clientId: socket.clientId
	})
}

socket.start()
