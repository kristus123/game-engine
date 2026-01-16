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
		this.oneTimeListeners.clear()
	}

	listen(callback) {
		Assert.method(callback)
		this.listeners.push(callback)
	}

	listenOnce(callback) {
		Assert.method(callback)
		this.oneTimeListeners.push(callback)
	}
}

