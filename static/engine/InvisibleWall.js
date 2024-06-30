export class InvisibleWall extends StaticGameObject {
	constructor(position, object) {
		super(position)
	}

	update() {
		const object = this.object
		if (Collision.between(this, object)) {
			if (this.hitRightEdge(object)) {
				console.log('hei')
				object.velocity.y = 0
			}
		}

	}

	draw(draw, guiDraw) {
		draw.transparentRedRectangle(this.position)
	}
}
