export class AllObjects { // not a good name
	constructor(objects=[]) {
		for (const o of objects) {
			o.removeFromLoop = () => {
				this.remove(o)
			}

			o.handledBy = this

			if (o instanceof Enemy) {
				Registry.enemies.push(o)
			}

		}
	}

	add(o) {
		this.objects.push(o)

		o.removeFromLoop = () => {
			this.remove(o)
		}

		o.handledBy = this

		if (o instanceof Enemy) {
			Registry.enemies.push(o)
		}


		return o
	}

	remove(o) {
		List.remove(this.objects, o)
		List.remove(Registry.enemies, o)
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

}

