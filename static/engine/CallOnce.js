export class CallOnce {
	constructor(predicate) {
		this.firstTimeFinish = new FirstTimeFinish(predicate)
	}

	update() {
		if (this.firstTimeFinish.returnTrueIfFinishedOnce()) {
			Call()
		}
		
	}
}
