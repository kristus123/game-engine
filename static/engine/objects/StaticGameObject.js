export class StaticGameObject {
	constructor(_x, _y, _width, _height, srcPicture='nullable') {
		if (srcPicture != 'nullable') { // temp hack until i figure out what to do
			this.picture = new Picture(this, srcPicture)
		}

		this.position = new Position(_x, _y, _width, _height)

		this.uuid = Uuid.create()
	}

	update() { }

	draw(draw, guiDraw) {
		if (this.picture) {
			this.picture.draw(draw, guiDraw)
		}
		else {
			draw.new_rectangle(this.position)
		}
	}

	get x() {
		return this.position.x
	}

	get y() {
		return this.position.y
	}

	set x(x) {
		this.position.x = x
	}

	set y(y) {
		this.position.y = y
	}

	get width() {
		return this.position.width
	}

	get height() {
		return this.position.height
	}

	set width(w) {
		this.position.width = w
	}

	set height(h) {
		this.position.height = h
	}

}
