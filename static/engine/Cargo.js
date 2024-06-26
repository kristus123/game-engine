export class Cargo extends DynamicGameObject {
	constructor(objects=[], connectedTo) {
		super(new Position(0, 0), 10, 10)
	}

	update() {
		for (const o of this.objects) {
			ForcePush(o).towards(this, 10)
		}

		ForcePush(this).towards(this.connectedTo, 10)
	}


	draw(draw, guiDraw) {
		draw.transparentGreenRectangle(this.position)
	}

}
