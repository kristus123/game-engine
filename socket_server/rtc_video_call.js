const SocketServer = require('./SocketServer')
const server = new SocketServer(8082)
const rooms = {}

server.onConnection = (client, clientId) => {
	console.log(clientId);
	server.sendToClient(client,{
		action:"RTC_CLIENT_INFO",
		clientId:clientId
	})
	for (let i = 0; i < server.allClientIds.length; i++) {
		const id = server.allClientIds[i];
		if(id == clientId)continue;
		server.sendToClient(server.clientFrom[id],{
			action: 'RTC_CLIENT_CONNECTED',
			clientId: clientId
		})
		break;
	}
		
	/*for (let i = 0; i < server.allClientIds.length; i++) {
		const id = server.allClientIds[i];
		if(id == clientId)continue;
		server.sendToClient(client,{
			action: 'RTC_CLIENT_CONNECTED',
			clientId: id
		})
	}*/
	
}

server.onClose = (client, clientId) => {
	server.sendToOthers(client,{
		action: 'RTC_CLIENT_DISCONNECTED',
		clientId: clientId,
	})
}
server.on("RTC_CLIENT_CONNECTED",(client, clientId, data)=>{
	server.sendToClient(server.clientFrom[data.clientId],{
		action: 'RTC_CLIENT_CONNECTED',
		clientId: clientId
	})
	for (let i = 0; i < server.allClientIds.length; i++) {
		const id = server.allClientIds[i];
		let skipId = false
		for (let j = 0; j < data.connectedClientId.length; j++) {
			const cid = data.connectedClientId[j];
			if(cid == id){skipId = true;break;}
		}
		if(id == clientId || id == data.clientId||skipId)continue;
		server.sendToClient(client,{
			action: 'RTC_CLIENT_CONNECTED',
			clientId: id
		})
		break;
	}
})
server.on('RTC_ICE_CANDIDATE', (client, clientId, data) => {
	server.sendToClient(server.clientFrom[data.clientId], {
		action: 'RTC_ICE_CANDIDATE',
		candidate: data.candidate,
		clientId:data.clientId
	})
})
server.on('RTC_OFFER', (client, clientId, data) => {
	console.log(clientId + " to "+data.clientId);
	server.sendToClient(server.clientFrom[data.clientId], {
		action: 'RTC_OFFER',
		offer: data.offer,
		clientId:data.clientId,
		fromClientId:clientId
	})
})

server.on('RTC_ANSWER', (client, clientId, data) => {
	server.sendToClient(server.clientFrom[data.fromClientId], {
		action: 'RTC_ANSWER',
		answer: data.answer,
		clientId:data.clientId,
		fromClientId:data.fromClientId
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