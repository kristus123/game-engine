// Service Worker for Push Notifications
self.addEventListener('push', event => {
	console.log('Push notification received')

	let data = {
		title: 'Notification',
		body: 'You have a new notification',
		icon: '/icon.png',
		badge: '/badge.png',
		data: {},
	}

	try {
		data = event.data ? event.data.json() : data
	}
	catch (error) {
		console.error('Error parsing push data:', error)
	}

	const options = {
		body: data.body,
		icon: data.icon || '/icon.png',
		badge: data.badge || '/badge.png',
		data: data.data,
		vibrate: [200, 100, 200],
		tag: 'game-notification',
		requireInteraction: false,
		actions: data.actions || [],
	}

	event.waitUntil(
		self.registration.showNotification(data.title, options)
	)
})

self.addEventListener('notificationclick', event => {
	console.log('Notification clicked:', event.notification.tag)
	event.notification.close()

	// Handle custom actions
	if (event.action) {
		console.log('Action clicked:', event.action)
	}

	// Open or focus the app
	event.waitUntil(
		clients.matchAll({ type: 'window' }).then(clientList => {
			// If a window is already open, focus it
			for (const client of clientList) {
				if (client.url === '/' && 'focus' in client) {
					return client.focus()
				}
			}

			// Otherwise, open a new window
			if (clients.openWindow) {
				return clients.openWindow('/')
			}
		})
	)
})

self.addEventListener('notificationclose', event => {
	console.log('Notification closed:', event.notification.tag)
})
