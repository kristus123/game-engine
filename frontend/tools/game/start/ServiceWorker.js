export class ServiceWorker {
	static init() {
		if ("serviceWorker" in navigator) {
			// we could use ENVIRONMENT here
			// navigator.serviceWorker.getRegistrations().then(r => r.forEach(sw => sw.unregister()))
			navigator.serviceWorker.register("/serviceWorker.js")
		}
	}
}
