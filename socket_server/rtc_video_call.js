const SocketServer = require('./SocketServer')
const server = new SocketServer(8082)
server.onConnection = (client, clientId) => {
    console.log(clientId);
	server.sendToClient(client, {
		action: 'RTC_CLIENT_CONNECTED',
		clientId: clientId,
	})
}