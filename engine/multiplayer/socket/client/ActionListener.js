export class ActionListener {
	constructor() {
		this.listener = {}
	}

	// This Function Does Not Have Error Checking: It prints the error because of race condition and then works anyways. Basically producing a false alarm.
	run(action, data) {
		if (this.listener[action]) {
			this.listener[action](data)
		}
	}

	register(action, callback) {
		if (this.listener[action]) {
			throw new Error(`Failed To Register Listener For Action "${action}" It Already Exists!`)
		}
		else {
			this.listener[action] = callback
		}
	}
}
