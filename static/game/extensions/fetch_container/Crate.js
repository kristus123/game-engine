export class Crate extends DynamicGameObject {
	constructor(position) {
		super(position.x, position.y, 200, 200, 50, 300, 'https://cdn-icons-png.flaticon.com/512/6618/6618414.png')
	}

	update() {

	}

	onCollision(o) {
		ForcePush(this).awayFrom(o, 1.1)
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
		draw.new_circle(this.position.center)
	}

}
