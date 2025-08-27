export class Bounce {
	constructor(object) {
		this.localObjects = new LocalObjects([
			this.motion = new Motion(),
		])

		this.motion.start()
	}

	start() {
		this.motion.start()
	}

	update() {
		this.object.position.scale(this.motion.value)
	}

	draw() {
	}
}
