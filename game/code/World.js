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
					location.reload()
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

		OtherConnectedSocketClients.onConnect = connectingClientId => {
			console.log(connectingClientId)
			const button = Html.button(connectingClientId, () => {
				RtcClient.call(connectingClientId)
			})

			GridUi.left.push(button)

			OtherConnectedSocketClients.onDisconnect = clientId => {
				button.remove()
			}
		}

		RtcClient.onIncomingCall = callerClientId => {
			GridUi.mid.push([
				Html.button('accept call', () => {
					RtcClient.acceptCall(callerClientId)
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
