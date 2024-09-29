export class _GameObject {
	constructor(position) {

		this.position = position.copy()

		this._objectId = Random.uuid()
	}

	touches(o) {
		return Collision.between(this.position, o)
	}

	touchesAny(list) {
		for (const o of list) {
			if (Collision.between(this.position, o)) {
				return true
			}
		}

		return false
	}

	within(distance, o) {
		return Distance.within(distance, this, o)
	}

	notWithin(distance, o) {
		return Distance.notWithin(distance, this, o)
	}

	get objectId() {
		//if (this._objectId) {
		return this._objectId
		//}
		//else {
		//	throw new Error('objectId is not set, make sure you have set it')
		//}
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
		draw.rectangle(this)
	}



}
