export class PushNotification {
	static get supported() {
		return window.isSecureContext
			&& "serviceWorker" in navigator
			&& "PushManager" in window
			&& "Notification" in window
	}

	static async subscribe() {
		if !this.supported {
			throw new Error("Push notifications are not supported by this browser")
		}

		if Notification.permission == "denied" {
			throw new Error("Push notifications are blocked by browser permissions")
		}

		if Notification.permission != "granted" {
			const permission = await Notification.requestPermission()
			if permission != "granted" {
				throw new Error("Push notification permission was not granted")
			}
		}

		const registration = await navigator.serviceWorker.register("/serviceWorker.js")
		await navigator.serviceWorker.ready

		let subscription = await registration.pushManager.getSubscription()
		if !subscription {
			const { publicKey } = await JsonHttpClient.getVapidPublicKey()
			subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: this.decodeApplicationServerKey(publicKey),
			})
		}

		await JsonHttpClient.subscribe({ body: { subscription } })
		return subscription
	}

	static async unsubscribe() {
		if !("serviceWorker" in navigator) {
			return false
		}

		const registration = await navigator.serviceWorker.getRegistration("/")
		const subscription = await registration?.pushManager.getSubscription()
		if !subscription {
			return false
		}

		await JsonHttpClient.unsubscribe({ body: { endpoint: subscription.endpoint } })
		return await subscription.unsubscribe()
	}

	static push(title, body) {
		return JsonHttpClient.triggerNotification({ body: { title, body } })
	}

	static decodeApplicationServerKey(key) {
		const base64 = key.replace(/-/g, "+").replace(/_/g, "/")
		const binary = atob(base64)
		return Uint8Array.from(binary, character => character.charCodeAt(0))
	}
}
