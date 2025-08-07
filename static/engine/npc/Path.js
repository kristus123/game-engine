export class Path {
	constructor(points) {
	}

	update() {
	}

	draw(draw, guiDraw) {
		for (const p of this.points) {
			draw.rectangle(p)
		}
	}
}
