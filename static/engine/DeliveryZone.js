export class DeliveryZone extends StaticGameObject {
	constructor(position, objectsToDeliver=[]) {
		super(position)
	}

	inside(o) {
		return Collision.between(this, o)
	}

	update() {
		
	}

	draw(draw, guiDraw) {
		draw.transparentGreenRectangle(this.position)
	}

}
