export class DeliveryZone extends StaticGameObject {
	constructor(position, objectsToDeliver=[]) {
		super(position, '')

		AssertArray(objectsToDeliver)
		AssertNoNullInArray(objectsToDeliver)

		this.deliveredObjects = []
	}

	completed() {
		return this.deliveredObjects.length == this.objectsToDeliver.length
	}


	inside(o) {
		return Collision.between(this, o)
	}

	get amountDelivered() {
		return this.deliveredObjects.length
	}

	update() {
		for (const o of this.objectsToDeliver) {
			if (Collision.between(this, o) && !List.includes(this.deliveredObjects, o)) {
				this.deliveredObjects.push(o)
			}
		}

		for (const o of this.deliveredObjects) {
			o.velocity.x = 0
			o.velocity.y = 0
		}
	}

	draw(draw, guiDraw) {
		draw.transparentGreenRectangle(this.position)
	}

}
