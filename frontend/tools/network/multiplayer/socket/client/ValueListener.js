export class ValueListener {
	constructor(value) { // allow-null
		this.listener = Listener()
		this._value = value
	}

	listen(callback) {
		this.listener.listen(callback)
	}

	listenOnce(callback) {
		this.listener.listenOnce(callback)
	}

	get value() {
		return this._value
	}

	set value(value) { // allow-null
		if this._value == value {
			return
		}

		this._value = value
		this.listener.trigger(value)
	}
}
