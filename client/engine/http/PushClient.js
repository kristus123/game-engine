export class PushClient {
	static {
		this.reg = null
	}

	static async register() {
		this.reg = await navigator.serviceWorker.register("/sw-push.js")
	}

	static async subscribe(vapid) {
		const existingSub = await this.reg.pushManager.getSubscription()

		if (existingSub) {
			throw new Error("Subscription Exists Already!")
		}

		const subscription = await this.reg.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: Uint8Array.fromBase64(vapid)
		})

		HttpClient.subscribe({ subscription: subscription }, () => {})
	}

	static push(title, body) {
		HttpClient.triggerNotification({ title: title, body: body }, () => {})
	}
}
