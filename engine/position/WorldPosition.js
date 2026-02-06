export class WorldPosition {
	constructor(_x, _y, _width = 1, _height = 1) {
		this._width = _width
		this._height = _height

		this.center = CenterPosition(this, _width, _height)

		this._original = null // will be set on first scale()
	}

	randomPoint() {
		const x = Random.integerBetween(this.x, this.x + this.width)
		const y = Random.integerBetween(this.y, this.y + this.height)
		return WorldPosition(x, y)
	}

	get x() {
		return this._x
	}

	get y() {
		return this._y
	}

	set x(new_x) {
		Assert.integer(new_x)
		this._x = new_x
	}

	set y(new_y) {
		Assert.integer(new_y)
		this._y = new_y
	}

	// todo implement instead of using Camera.p
	// ScreenPosition() {

	// }

	get topLeft() {
		return this.offset(-(this.width / 2), -(this.height / 2), 20, 20)
	}

	get bottomRight() {
		return this.offset(this.width, this.height, 20, 20)
	}

	xy(p) {
		this.x = p.x
		this.y = p.y
	}

	set(x = this.x, y = this.y, w = this.width, h = this.height) {
		this.x = x
		this.y = y
		this.width = w
		this.height = h
		return this
	}

	copy(offset_x = 0, offset_y = 0) {
		return WorldPosition(this.x + offset_x, this.y + offset_y, this.width, this.height)
	}

	offset(offset_x = 0, offset_y = 0, width = this.width, height = this.height) {
		return OffsetPosition(this, offset_x, offset_y, width, height)
	}

	over(y = 100) {
		return this.offset(this.width / 2, -y)
	}

	right(x = 100) {
		return this.offset(this.width + x, 0)
	}

	up(amount) {
		this.y += amount
		return this
	}

	left(amount) {
		this.x -= amount
		return this
	}

	get width() {
		return this._width
	}

	get height() {
		return this._height
	}

	set width(w) {
		this._width = w
	}

	set height(h) {
		this._height = h
	}

	// Always scales based on first recorded "original"
	scale(amount) {
		// store original only the first time
		if (!this._original) {
			this._original = {
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height
			}
		}

		const cx = this.center.x
		const cy = this.center.y

		this.width = this._original.width * amount
		this.height = this._original.height * amount

		this.x = cx - this.width / 2
		this.y = cy - this.height / 2

		return this
	}

	size(width, height) {
		this.width = width
		this.height = height
		return this
	}

	behind(anotherPosition, distance = 200) {
		return AnalShit.positionBehind(this, anotherPosition, distance)
	}

	// Reset to the first scale()'s original size & position
	reset() {
		if (!this._original) {
			return this
		} // no scaling yet
		this.x = this._original.x
		this.y = this._original.y
		this.width = this._original.width
		this.height = this._original.height
		return this
	}

	draw(draw) {
		draw.rectangle(this)
	}

	smooth(smoothness = 0.1, snapThreshold = 1) {
		return new SmoothPosition(this, smoothness, snapThreshold)
	}

	toJson() {
		return {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
		}
	}

	*points() {
		for (let yy = this.y; yy < this.y + this.height; yy++) {
			for (let xx = this.x; xx < this.x + this.width; xx++) {
				yield { x: xx, y: yy }
			}
		}
	}

	moveTowards(o) {
		const dx = o.x - this.x
		const dy = o.y - this.y

		if (Math.abs(dx) > Math.abs(dy)) {
			this.x += Math.sign(dx)
		}
		else if (dy !== 0) {
			this.y += Math.sign(dy)
		}
	}

	static from(jsonPosition) {
		return WorldPosition(jsonPosition.x, jsonPosition.y, jsonPosition.width, jsonPosition.height)
	}
}

