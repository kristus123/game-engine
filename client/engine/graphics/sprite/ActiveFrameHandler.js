export class ActiveFrameHandler {
	constructor(totalFrames) {
		this.currentFrame = IntegerLoop(0, totalFrames)
		this.stopWatch = StopWatch().start()
	}

	get value() {
		return this.currentFrame.value
	}

	next() {
		this.currentFrame.next()
	}

	update(duration) {
		if (this.stopWatch.time >= duration) {
			this.currentFrame.next()
			this.stopWatch.restart()
		}
	}
}
