export class RunOnce {
	constructor(run) {
		run()
		this.removeFromLoop()
	}
}
