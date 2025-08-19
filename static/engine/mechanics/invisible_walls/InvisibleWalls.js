export class InvisibleWalls extends StaticGameObject {
	constructor(position) {
		super(position)

		if (this.position.width == 1) {
			this.position.width = 100
			this.position.height = 100
		}
	}

	enforce(object) {
		if (Collision.between(this, object)) {
			const currentPosition = { x: object.position.x, y: object.position.y }

			object.position.x = object.previousPosition.x
			if (!Collision.between(this, object)) {

				object.velocity.x = 0
				object.position.x = object.previousPosition.x
				return
			}
			else {
				object.position.x = currentPosition.x
			}

			object.position.y = object.previousPosition.y
			if (!Collision.between(this, object)) {

				object.velocity.y = 0
				object.position.y = object.previousPosition.y
				return
			}
			else {
				object.position.y = currentPosition.y
			}
		}
	}

	draw(draw, guiDraw) {
		draw.transparentRedRectangle(this.position)
	}

}
