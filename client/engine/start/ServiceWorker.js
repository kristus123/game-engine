export class ServiceWorker {
	static init() {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.getRegistrations().then(r => r.forEach(sw => sw.unregister()))
			// navigator.serviceWorker.register('/sw.js') // add this back when our sw is ready
		}
	}
}
