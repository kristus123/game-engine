export class AllObjects {
	constructor() {
		this.objects = []
	}

	add(o) {
		this.objects.push(o)
	}

	remove(o) {
		List.remove(this.objects, o)
	}

	removeByObjectId(objectId) {
		for (const o of this.objects) {
			if (o.objectId == objectId) {
				List.remove(this.objects, o)

				break
			}
		}
	}

	setHandledBy(objectId, clientId) {
		for (const o of this.objects) {
			if (o.objectId == objectId) {
				o.handledByClientId = clientId

				break
			}
		}
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

