export function Task(stuff) {
	return () => new class {
		constructor() {
			this.localObjects = Objects(stuff)
		}

		update() {
			this.localObjects.update()
		}

	}
}
