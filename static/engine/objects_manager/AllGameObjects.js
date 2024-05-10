export class AllGameObjects {
	constructor() {

		this.all = []

		this.gameObjectUuid = {}
		this.uuidForGameObject = {}

		this.origins = {}

		// todo reimplement
		// for (const c of classes) {
		// 	if (c == null) {
		// 		throw new Error('null passed into Runall')
		// 	}
		// }
	}

	register(origin, gameObjects) {
		for (const g of gameObjects) {
			this.add(origin, g)
		}
	}

	add(origin, gameObject) {
		if (!this.origins[origin]) {
			this.origins[origin] = new RunAll()
		}

		this.origins[origin].add(gameObject)

		const uuid = Random.uuid()

		this.all.push({uuid, gameObject})

		this.gameObjectUuid[gameObject] = uuid
		this.uuidForGameObject[uuid] = gameObject

		return gameObject
	}

	remove(origin, gameObject) {
		List.remove(this.all, o)

		this.origins[origin].remove(o)

		const uuid = this.gameObjectUuid[gameObject]

		delete this.gameObjectUuid[gameObject]
		delete this.uuidForGameObject[uuid]
	}

	update() {
		Ra.update(this.all)
	}

	draw(draw, guiDraw) {
		Ra.draw(this.all, draw, guiDraw)
	}
}
