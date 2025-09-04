import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 

export function Task(stuff) {
	return () => new class {
		constructor() {
			this.localObjects = new LocalObjects(stuff)
		}

		update() {
			this.localObjects.update()
		}

		draw(draw, guiDraw) {
			this.localObjects.draw(draw, guiDraw)
		}
	}
}
