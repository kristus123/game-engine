export class Compass {
	constructor( camera, targets=[]) {
	}

	draw(draw, guiDraw) {
		for (const t of this.targets) {
			draw.objectThatIsMovingInRectangularPathAroundObject(this.camera, t.position, t.color)
		}
	}

	clear() {
		this.targets = []
	}

	add(position, color) {
		this.targets.push({ position, color })
	}

	remove(position, color) {
		List.removeIf(this.targets, t => t.position === position)
	}
}
