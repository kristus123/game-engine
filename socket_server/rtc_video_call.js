const SocketServer = require('./SocketServer')
const server = new SocketServer(8082)
server.onConnection = (client, clientId) => {
	server.sendToClient(client,{
		action:"RTC_CLIENT_INFO",
		clientId:clientId,
	})
	server.sendToOthers(client,{
		action: 'RTC_CLIENT_CONNECTED',
		clientId: clientId
	})
	for (let i = 0; i < server.allClientIds.length; i++) {
		const id = server.allClientIds[i];
		if(id == clientId)continue;
		server.sendToClient(client,{
			action: 'RTC_CLIENT_CONNECTED',
			clientId: id
		})
		
	}
}
server.onClose = (client, clientId) => {
	server.sendToOthers(client,{
		action: 'RTC_CLIENT_DISCONNECTED',
		clientId: clientId,
	})
}
server.on('RTC_ICE_CANDIDATE', (client, clientId, data) => {
	server.sendToOthers(client, {
		action: 'RTC_ICE_CANDIDATE',
		candidate: data.candidate,
		clientId:data.clientId
	})
})
server.on('RTC_OFFER', (client, clientId, data) => {
	console.log(clientId + " to "+data.clientId);
	server.sendToOthers(client, {
		action: 'RTC_OFFER',
		offer: data.offer,
		clientId:data.clientId
	})
})

server.on('RTC_ANSWER', (client, clientId, data) => {
	server.sendToOthers(client, {
		action: 'RTC_ANSWER',
		answer: data.answer,
		clientId:data.clientId
	})
})

server.on('RTC_HANGUP', (client, clientId, data) => {
	console.log("icesc" +clientId + " to "+data.clientId);
	server.sendToOthers(client, {
		action: 'RTC_HANGUP',
		clientId:data.clientId
	})
})
server.start()