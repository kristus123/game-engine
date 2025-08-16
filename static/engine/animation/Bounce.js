export class Bounce {
	constructor(object) {
		this.localObjects = new LocalObjects([
			this.motion = new Motion(),
		])

		this.motion.start()
	}

	update() {
		console.log(this.motion.value)
		this.object.position.scale(this.motion.value)

		// if (!this.motion.playing) {
		// 	this.removeFromLoop()
		// }
	}

	draw(draw, guiDraw) {
	}
}
