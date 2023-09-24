export class Schedule {
	constructor() {
		this.counter = 0
	}

	everyFrame(frame, run) {
		if (this.counter >= frame) {
			run()
			console.log('running')
			this.counter = 0
		}
		else {
			this.counter += 1
		}
	}
}
