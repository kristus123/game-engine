export class Listener {
	constructor() {
		this.listeners = []
	}

	run(data) {
		for (const xxx of this.listeners) {
			xxx(data)
		}
	}

	register(callback) {
		this.listeners.push(callback)
	}
}
