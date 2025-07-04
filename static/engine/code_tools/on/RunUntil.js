export class RunUntil {
	constructor(run) {
	}

	update() {
		const r = this.run()
		if (r) {
			this.removeFromLoop()
		}
	}

	draw(draw, guiDraw) {
	}
}
