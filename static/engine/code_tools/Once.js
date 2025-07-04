export class Once {
	constructor(run) {
		run()
	}

	completed() {
		return true
	}
}
