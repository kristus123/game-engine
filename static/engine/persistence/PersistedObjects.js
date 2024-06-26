export class PersistedObjects extends AllObjects {
	constructor(filePath) {
		super([])
		this.objectPersistence = new ObjectPersistence(filePath)

		for (const o of this.objectPersistence.get()) {
			super.add(o)
		}
	}

	add(o) {
		this.objectPersistence.save(o)
		super.add(o)
	}

	persist(o) {
		this.objectPersistence.update(o)
	}

	update() {
		super.update()
	}

	remove(o) {
		this.objectPersistence.remove(o)
		super.remove(o)
	}
}
