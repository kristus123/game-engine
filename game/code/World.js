// ClientId(

export class World {
	constructor() {
		// Check if already subscribed by looking for saved endpoint
		let savedEndpoint = null
		try {
			savedEndpoint = localStorage.getItem('pushSubscriptionEndpoint')
		} catch (e) {
			// Safari private mode throws error on localStorage access
			console.warn('LocalStorage not available:', e.message)
		}
		
		if (savedEndpoint) {
			// Verify endpoint still exists in database
			fetch('http://localhost:3001/push/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ endpoint: savedEndpoint })
			})
			.then(response => response.json())
			.then(data => {
				if (!data.exists) {
					try {
						localStorage.removeItem('pushSubscriptionEndpoint')
					} catch (e) {}
					
				}
			})
			.catch(error => {
				console.error('Error verifying endpoint:', error)
			})
		} else if ('Notification' in window && Notification.permission === 'granted') {
			// Permission already granted, auto-subscribe
			this.setupPushNotifications()
		} else {
			// Need user interaction to request permission
			const notificationButton = Html.button('🔔 Enable Notifications', () => {
				this.setupPushNotifications()
				notificationButton.remove()
			})
			GridUi.left.push(notificationButton)
		}

		const clientButtons = new Map()

		OtherConnectedSocketClients.onConnect = connectingClientId => {
			const button = Html.button("call " + connectingClientId, () => {
				RtcClient.call(connectingClientId)
			})

			clientButtons.set(connectingClientId, button)
			GridUi.left.push(button)
		}

		OtherConnectedSocketClients.onDisconnect = clientId => {
			const button = clientButtons.get(clientId)
			if (button) {
				button.remove()
				clientButtons.delete(clientId)
			}
		}

		// Create buttons for clients that connected before this handler was set
		for (const clientId of OtherConnectedSocketClients.ids) {
			OtherConnectedSocketClients.onConnect(clientId)
		}

		RtcClient.onIncomingCall = (callerClientId, offer) => {
			GridUi.mid.push([
				Html.button('accept call', () => {
					RtcClient.acceptIncomingCall(callerClientId, offer)
				})
			])
		}

		RtcClient.onCallAccepted = targetClientId => {
			GridUi.right.push([
				Html.button('send', () => {
					console.log(`sending data to ${targetClientId}`)
					RtcClient.send(targetClientId, { 'text': 'hello' })
				}),
			])
		}

		const player = new DynamicGameObject(new Position(8000, 6000))

		Controller.control(player)
		Camera.followInstantly(player)

		this.localObjects = new LocalObjects([
			Sprite.snow(new Position(0, 0), 6),
			Sprite.samurai(player.position, 0.5),
		])

		SocketClient.onServerMessage('UPDATE_CLIENTS_LIST', data => {
			console.log(`Logging From Game: ${JSON.stringify(data)}.`)
		})
	}

	async setupPushNotifications() {
		const pushClient = new PushNotificationClient('http://localhost:3001')
		
		pushClient.getPublicKey()
			.then(publicKey => pushClient.subscribe(publicKey))
			.catch(error => {
				console.error('Failed to subscribe to push notifications:', error.message)
			})
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {}
}
