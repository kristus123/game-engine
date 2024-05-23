export class DeliveryZone extends StaticGameObject {
	constructor(position, objectsToDeliver=[]) {
		super(position)

		this.deliveredObjects = []
	}

	inside(o) {
		return Collision.between(this, o)
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

		console.log('delivered ' + this.deliveredObjects.length)
	}

	draw(draw, guiDraw) {
		draw.transparentGreenRectangle(this.position)
	}

}
