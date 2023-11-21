export class Animation {
	constructor() {
		this.currentFrame = 0
		this.endFrame = 40
	}

	get active() {
		if (this.currentFrame++ < this.endFrame) {
			this.currentFrame++
			return true
		}
		else {
			return false
		}
	}

	reset() {
		this.currentFrame = 0
	}

}
