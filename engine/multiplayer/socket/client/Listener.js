export class Listener {
	constructor() {
		this.listeners = []
		this.oneTimeListeners = []
	}

	trigger(...args) {
		this.listeners.forEach(l => l(args));

		this.oneTimeListeners.forEach(l => l(args));
		this.oneTimeListeners.clear()
	}

	listen(callback) {
		this.listeners.push(callback)
	}

	listenOnce(callback) {
		this.oneTimeListeners.push(callback)
	}
}
