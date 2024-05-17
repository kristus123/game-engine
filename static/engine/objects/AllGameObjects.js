export class AllGameObjects {
	constructor() {
		this.objects = []
	}

	updateAnd(run) {
		X.update(this.objects, run)
	}

	draw(draw, guiDraw) {
		X.draw(this.objects, draw, guiDraw)
	}

	add(o) {
		this.objects.push(o)
	}

	remove(o) {
		List.remove(this.objects, o)
	}

	removeByObjectId(objectId) {
		for (const o of this.objects) {
			if (o.uuid == objectId) {
				List.remove(this.objects, o)

				break
			}
		}
	}

	setHandledBy(objectId, clientId) {
		for (const o of this.objects) {
			if (o.uuid == objectId) {
				o.handledByClientId = clientId

				break
			}
		}
	}

	getByObjectId(objectId, run) {
		for (const o of this.objects) {
			if (o.uuid == objectId) {
				run(o)
				break
			}
		}
	}
}

