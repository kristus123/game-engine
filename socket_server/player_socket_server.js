const SocketServer = require('./SocketServer')

const s = new SocketServer(8080)

s.onConnection = (client, clientId) => {
	s.sendToOthers(client, {
		action: 'CONNECT_PLAYER',
		clientId: clientId,
	})
	s.sendToOthers(client,{
		action: 'RTC_CLIENT_CONNECTED',
		clientId: clientId,
	})
}

s.onClose = (client, clientId) => {
	s.sendToOthers(client, {
		action: 'PLAYER_DISCONNECTED',
		clientId: clientId,
	})
	s.sendToOthers(client,{
		action: 'RTC_CLIENT_DISCONNECTED',
		clientId: clientId,
	})
}

s.on('UPDATE_PLAYER_POSITION', (client, clientId, data) => {
	s.sendToOthers(client, {
		action: 'UPDATE_PLAYER_POSITION',
		clientId: clientId,
		x: data.x,
		y: data.y,
	})
})

s.on('UPDATE_MOUSE_POSITION', (client, clientId, data) => {
	s.sendToOthers(client, {
		action: 'UPDATE_MOUSE_POSITION',
		clientId: clientId,
		x: data.x,
		y: data.y,
	})
})
s.on('RTC_ICE_CANDIDATE', (client, clientId, data) => {
	console.log("ice works "+data.clientId);
	s.sendToOthers(client, {
		action: 'RTC_ICE_CANDIDATE',
		candidate: data.candidate,
		clientId:data.clientId
	})
})
s.on('RTC_OFFER', (client, clientId, data) => {
	s.sendToOthers(client, {
		action: 'RTC_OFFER',
		offer: data.offer,
		clientId:data.clientId
	})
})

s.on('RTC_ANSWER', (client, clientId, data) => {
	s.sendToOthers(client, {
		action: 'RTC_ANSWER',
		answer: data.answer,
		clientId:data.clientId
	})
})

s.on('RTC_HANGUP', (client, clientId, data) => {
	s.sendToOthers(client, {
		action: 'RTC_HANGUP',
		clientId:data.clientId
	})
})
s.start()
