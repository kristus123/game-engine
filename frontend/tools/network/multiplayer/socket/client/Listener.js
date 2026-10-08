export class Listener {
	constructor() {
		this.listeners = []
		this.oneTimeListeners = []
	}

	trigger(args) {
		this.listeners.forEach(l => l(args))

		this.oneTimeListeners.forEach(l => {
			console.log(l)
			l(args)
		})

		this.oneTimeListeners.length = 0 // todo use .clear() later
	}

	listen(callback) {
		this.listeners.push(callback)
	}

	listenOnce(callback) {
		this.oneTimeListeners.push(callback)
	}
}

