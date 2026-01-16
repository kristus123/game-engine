export class ActionListener {
	constructor() {
		this.listeners = {}
	}

	trigger(action, data) {
		this.listeners[action]?.trigger(data)
	}

	listen(action, callback) {
		this.listeners[action] ??= new Listener()
		this.listeners[action].listen(callback)
	}

	listenOnce(action, callback) {
		this.listeners[action] ??= new Listener()
		this.listeners[action].listenOnce(callback)
	}
}

