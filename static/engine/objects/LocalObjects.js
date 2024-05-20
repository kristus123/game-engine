export class LocalObjects {
	constructor(classes=[]) {
		List.assertNoNullElements(classes)
	}

	add(c) {
		this.classes.push(c)
		return c
	}

	remove(c) {
		List.remove(this.classes, c)
	}

	update() {
		HelperThing.update(this.classes)
	}

	draw(draw, guiDraw) {
		HelperThing.draw(this.classes, draw, guiDraw)
	}

}
