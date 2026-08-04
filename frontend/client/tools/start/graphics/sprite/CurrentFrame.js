export class CurrentFrame {
	constructor(totalFrames, framesToIterateThrough) {
	}

	get value() {
		return this.currentFrame.value
	}

	set value(n) {
		this.currentFrame.current = n
	}

	next() {
		this.currentFrame.next()
	}

	update(duration) {
	}
}
