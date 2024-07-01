export class InvisibleWall extends StaticGameObject {
	constructor(position, object) {
		super(position)
	}

	update() {
		const o = this.object

		if (Collision.between(this, o)) {
			const currentPosition = { x: o.position.x, y: o.position.y }

			o.position.x = o.previousPosition.x
			if (!Collision.between(this, o)) {
				console.log('x axis collision')

				o.velocity.x = 0
				o.position.x = o.previousPosition.x
				return
			}
			else {
				o.position.x = currentPosition.x
			}

			o.position.y = o.previousPosition.y
			if (!Collision.between(this, o)) {
				console.log('y axis collision')

				o.velocity.y = 0
				o.position.y = o.previousPosition.y
				return
			}
			else {
				o.position.y = currentPosition.y
			}
		}
	}

	draw(draw, guiDraw) {
		draw.transparentRedRectangle(this.position)
	}
}
