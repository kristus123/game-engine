export class AllObjects {
	constructor() {
		this.objects = []
		this.objectIdFrom = {}
		this.gameObjectFrom = {}
	}

	add(objectId, o) {
		this.objectIdFrom[o] = objectId

		this.gameObjectFrom[objectId] = o

		this.objects.push(o)
	}

	remove(o) {
		const objectId = this.objectIdFrom[o]

		delete this.objectIdFrom[o]

		delete this.gameObjectFrom[objectId]

		List.remove(this.objects, o)
	}

	removeByObjectId(objectId) {
		delete this.objectIdFrom[o]

		delete this.gameObjectFrom[objectId]

		List.remove(this.objects, o)
	}

	setHandledBy(objectId, clientId) {
		const o = this.gameObjectFrom[objectId]

		o.handledByClientId = clientId
	}

	get(objectId) {
		return this.gameObjectFrom[objectId]
	}

	updateAnd(run) {
		X.update(this.objects, run)
	}

	draw(draw, guiDraw) {
		X.draw(this.objects, draw, guiDraw)
	}

}

