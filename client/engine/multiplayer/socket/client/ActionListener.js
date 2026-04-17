export class ActionListener {
	constructor() {
		this.listeners = {}
	}

	trigger(action, data) {
		const listener = this.listeners[action]

		if (listener) {
			listener.trigger(data)
		}
		else {
			throw new Error(`unexpected action: ${action}, data: ${data}`)
		}
	}

	listen(action, callback) {
		this.listeners[action] ??= Listener()
		this.listeners[action].listen(callback)
	}

	listenOnce(action, callback) {
		this.listeners[action] ??= Listener()
		this.listeners[action].listenOnce(callback)
	}
}
