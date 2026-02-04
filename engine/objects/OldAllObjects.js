export class OldAllObjects { // not a good name
	constructor(objects=[]) {
		AssertArray(objects)
		AssertNoNullInArray(objects)

		for (const o of objects) {
			o.removeFromLoop = () => {
				this.remove(o)
			}
			o.loop = this // TODO this is very dangerous to do. !!!!!!!!!!!!!!!!!!!!!!! loop was overriden once, and it caused a head scratch

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
		this.objects.remove(o)
		Registry.remove(o)
	}

	removeAll() {
		for (const o of this.objects) {
			this.remove(o)
		}
	}

	anyUnless(thisTrue) {
		for (const o of this.objects) {
			if (!thisTrue(o)) {
				return o
			}
		}

		return null
	}

	anyExcept(itself) {
		for (const o of this.objects) {
			if (o !== itself) {
				return o
			}
		}

		return null
	}

	removeByObjectId(objectId) {
		for (const o of this.objects) {
			if (o.objectId == objectId) {
				this.objects.remove(o)

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

	empty() {
		return this.objects.empty()
	}

	first() {
		return this.objects[0]
	}

	closestTo(object, run= c => {}) {
		if (this.objects.empty()) {
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

