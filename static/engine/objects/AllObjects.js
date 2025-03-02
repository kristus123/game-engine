export class AllObjects { // not a good name
	constructor(objects=[]) {
		for (const o of objects) {
			o.removeFromLoop = () => {
				this.remove(o)
			}

			o.handledBy = this
			Registry.add(o)
		}
	}

	[Symbol.iterator]() {
		return this.objects[Symbol.iterator]()
	}

	forEach(callback) {
		return this.objects.forEach(callback)
	}

	add(o) {
		this.objects.push(o)

		o.removeFromLoop = () => {
			this.remove(o)
		}

		o.handledBy = this

		Registry.add(o)

		return o
	}

	remove(o) {
		List.remove(this.objects, o)
		Registry.remove(o)
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

	update() {
		HelperThing.update(this.objects)
	}

	updateAnd(run) {
		HelperThing.updateAnd(this.objects, run)
	}

	draw(draw, guiDraw) {
		HelperThing.draw(this.objects, draw, guiDraw)
	}

	empty() {
		return List.empty(this.objects)
	}

	first() {
		return this.objects[0]
	}

}

