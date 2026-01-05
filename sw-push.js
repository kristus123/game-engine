// Service Worker for Push Notifications

self.addEventListener('install', event => {
	self.skipWaiting()
})

self.addEventListener('activate', event => {
	event.waitUntil(clients.claim())
})

self.addEventListener('push', event => {
	let notificationData = {
		title: 'Notification',
		body: 'You have a new notification',
		data: {},
	}

	try {
		if (event.data) {
			notificationData = event.data.json()
		}
	}
	catch (error) {
		console.error('Error parsing push data:', error)
	}

	const options = {
		body: notificationData.body || 'You have a new notification',
		data: notificationData.data || {},
		vibrate: notificationData.vibrate || [200, 100, 200],
		tag: notificationData.tag || 'game-notification',
		requireInteraction: notificationData.requireInteraction || false,
	}

	// Add icon/badge only if provided (avoid missing file errors)
	if (notificationData.icon) {
		options.icon = notificationData.icon
	}
	if (notificationData.badge) {
		options.badge = notificationData.badge
	}
	if (notificationData.actions && notificationData.actions.length > 0) {
		options.actions = notificationData.actions
	}

	event.waitUntil(
		self.registration.showNotification(notificationData.title || 'Notification', options)
			.catch(error => {
				console.error('Error displaying notification:', error)
				// Fallback: try with minimal options
				return self.registration.showNotification(
					notificationData.title || 'Notification',
					{ body: notificationData.body || '' }
				)
			})
	)
})

self.addEventListener('notificationclick', event => {
	event.notification.close()

	// Handle custom actions
	if (event.action) {
		const actionHandlers = {
			'accept': () => {
				return clients.openWindow('/?action=accept&data=' + encodeURIComponent(JSON.stringify(event.notification.data)))
			},
			'decline': () => {
				return Promise.resolve()
			},
			'restart': () => {
				return clients.openWindow('/?action=restart')
			},
			'share': () => {
				if (self.navigator && self.navigator.share) {
					return self.navigator.share({
						title: event.notification.title,
						text: event.notification.body,
						url: self.location.origin
					}).catch(err => console.error('Share failed:', err))
				}
				// Fallback: just open the app
				return clients.openWindow('/')
			},
			'view': () => {
				const viewData = event.notification.data
				return clients.openWindow('/?action=view&type=' + (viewData.type || 'default'))
			},
			'close': () => {
				return Promise.resolve()
			}
		}

		const handler = actionHandlers[event.action]
		if (handler) {
			event.waitUntil(handler())
			return
		}
	}

	// Open or focus the app
	event.waitUntil(
		clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
			for (const client of clientList) {
				if (client.url.includes(self.location.origin)) {
					return client.focus()
				}
			}

			if (clients.openWindow) {
				return clients.openWindow('/')
			}
		}).catch(error => {
			console.error('Error handling notification click:', error)
		})
	)
})

self.addEventListener('notificationclose', event => {
	// Silent close
})

self.addEventListener('pushsubscriptionchange', event => {
	event.waitUntil(
		self.registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: event.oldSubscription ? event.oldSubscription.options.applicationServerKey : null
		})
			.then(newSubscription => {
				return fetch('http://localhost:3001/push/subscribe', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newSubscription),
				})
			})
			.catch(error => {
				console.error('Error re-subscribing:', error)
			})
	)
})