export function Task(stuff) {
	return () => new class {
		constructor() {
			this.localObjects = LocalObjects(stuff)
		}

		update() {
			this.localObjects.update()
		}

	}
}
