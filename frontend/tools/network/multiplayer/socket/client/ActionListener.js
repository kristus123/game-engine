export class ActionListener {
	constructor() {
		this.listeners = {}
	}

	trigger(action, message) {
		const listener = this.listeners[action]

		if (listener != null) {
			listener.trigger(message)
		}
		else {
			throw new Error(`undeclared action: ${action}, data: ${message.data}`)
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
