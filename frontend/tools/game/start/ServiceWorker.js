export class ServiceWorker {
	static init() {
		if ("serviceWorker" in navigator) {
			// we could use ENVIRONMENT here
			// navigator.serviceWorker.getRegistrations().then(r => r.forEach(sw => sw.unregister()))
			navigator.serviceWorker.register("/serviceWorker.js")
		}
	}

	static unregister() {
		navigator.serviceWorker.getRegistrations().then(registrations => {
			for (const registration of registrations) {
				registration.unregister()
			}
		})
	}
}
