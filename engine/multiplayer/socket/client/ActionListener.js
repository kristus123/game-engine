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
        		this.listener[action] = callback
	}
}
