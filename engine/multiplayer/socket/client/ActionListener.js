export class ActionListener {
	constructor() {
		this.listeners = {}
		this.oneTimeListeners = {}
	}

	trigger(action, data) {
		if (this.listeners[action]) {
			for (const c of this.listeners[action]) {
				c(data)
			}
		}

		if (this.oneTimeListeners[action]) {
			for (const c of this.oneTimeListeners[action]) {
				c(data)
				if (a.list(this.oneTimeListeners[action])) {
					console.log('sex')
				}
			}
		}

	}

	listen(action, callback) {
		if (this.listeners[action]) {
			this.listeners[action].add(callback)
		}
		else {
			this.listeners[action] = [callback]
		}
	}

	listenOnce(action, callback) {
		if (this.oneTimeListeners[action]) {
			this.oneTimeListeners[action].add(callback)
		}
		else {
			this.oneTimeListeners[action] = [callback]
		}
	}
}

const x = new ActionListener()

x.listenOnce('swag', v => {
	console.log(v)

})

x.trigger('swag', 1)
x.trigger('swag', 1)
