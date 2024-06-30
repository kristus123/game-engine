export class InvisibleWall extends StaticGameObject {
	constructor(position, object) {
		super(position)
	}

	update() {
		const object = this.object
		if (Collision.between(this, object)) {
		}

	}

	draw(draw, guiDraw) {
		draw.transparentRedRectangle(this.position)
	}
}
