export class AllObjects { // not a good name
	constructor(objects=[], connectedToClass='') {
		for (const o of objects) {
			o.removeFromLoop = () => {
				this.remove(o)
			}


			if (typeof o === 'object' && Object.keys(o).length == 2 && !o.update && !o.draw) {
				console.log("hei")
				if (connectedToClass != '') {
					const field = Object.keys(o)[0]

					connectedToClass[field] = o[field]
					List.remove(objects, o)

					objects.push(o[field])

					o[field].removeFromLoop = () => {
						this.remove(o[field])
					}
				}
			}
		}
	}

	add(o) {
		this.objects.push(o)
		return o
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

