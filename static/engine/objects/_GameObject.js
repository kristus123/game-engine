export class _GameObject {
	constructor(position, imagePath='nullable') {

		if (imagePath != 'nullable') { // temp hack until i figure out what to do
			this.picture = new Picture(this, imagePath)
		}

		this.position = position.copy()

		this._objectId = null
	}

	get objectId() {
		if (this._objectId) {
			return this._objectId
		}
		else {
			throw new Error('objectId is not set, make sure you have set it')
		}
	}

	set objectId(x) {
		this._objectId = x
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

	update() {
	}

	draw(draw, guiDraw) {
		if (this.picture) {
			this.picture.draw(draw, guiDraw)
		}
		else {
			draw.new_rectangle(this.position)
		}
	}
}
