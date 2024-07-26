export class Compass {
	constructor(targets=[]) {
	}

	one(position, color='red') {
		this.clear()
		this.add(position, color)

	}

	add(position, color='red') {
		this.targets.push({ position, color })
	}

	remove(position, color) {
		List.removeIf(this.targets, t => t.position === position)
	}

	clear() {
		this.targets = []
	}

	draw(draw, guiDraw) {
		for (const t of this.targets) {
			draw.objectThatIsMovingInRectangularPathAroundObject(t.position, t.color)
		}
	}
}
