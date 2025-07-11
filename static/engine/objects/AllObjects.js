export class AllObjects { // not a good name
	constructor(objects=[]) {
		AssertArray(objects)
		AssertNoNullInArray(objects)

		for (const o of objects) {
			o.removeFromLoop = () => {
				this.remove(o)
			}
			o.loop = this

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

	get length() {
		return this.objects.length
	}

	add(o) {
		this.objects.push(o)

		o.removeFromLoop = () => {
			this.remove(o)
		}
		o.loop = this

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

	closestTo(object, run= c => {}) {
		if (List.empty(this.objects)) {
			return null
		}

		let closest = this.objects[0]

		for (const o of this.objects) {
			if (Distance.between(object, o) < Distance.between(closest, object)) {
				closest = o
			}
		}

		if (closest) {
			run(closest)
		}

		return closest
	}

}

