const SocketServer = require('./SocketServer')
const server = new SocketServer(8082)
server.onConnection = (client, clientId) => {
	server.sendToClient(client,{
		action:"RTC_CLIENT_INFO",
		fromClientId:clientId,
	})
	server.sendToOthers(client,{
		action: 'RTC_CLIENT_CONNECTED',
		fromClientId: clientId
	})
	for (let i = 0; i < server.allClientIds.length; i++) {
		const id = server.allClientIds[i];
		if(id != clientId){
			server.sendToClient(client,{
				action: 'RTC_CLIENT_CONNECTED',
				fromClientId: id
			})
		}
	}
}
server.onClose = (client, clientId) => {
	server.sendToOthers(client,{
		action: 'RTC_CLIENT_DISCONNECTED',
		fromClientId: clientId,
	})
}
server.on('RTC_ICE_CANDIDATE', (client, clientId, data) => {
	server.sendToOthers(client, {
		action: 'RTC_ICE_CANDIDATE',
		candidate: data.candidate,
		fromClientId:data.fromClientId
	})
})
server.on('RTC_OFFER', (client, clientId, data) => {
	server.sendToClient(server.clientFrom[data.toClientId], {
		action: 'RTC_OFFER',
		offer: data.offer,
		fromClientId:data.fromClientId,
		toClientId:data.toClientId
	})
})

server.on('RTC_ANSWER', (client, clientId, data) => {
	server.sendToClient(server.clientFrom[data.fromClientId], {
		action: 'RTC_ANSWER',
		answer: data.answer,
		fromClientId:data.fromClientId,
		toClientId:data.toClientId
	})
})

server.on('RTC_HANGUP', (client, clientId, data) => {
	server.sendToOthers(client, {
		action: 'RTC_HANGUP',
		fromClientId:data.fromClientId
	})
})
server.start()