export class Velocity {
	constructor(object, _x=0, _y=0) {
		this.position = WorldPosition(0, 0)
	}

	get x() {
		return this._x
	}

	set x(new_x) {
		this._x = new_x

		this.position.x = this.object.x + this._x
	}

	get y() {
		return this._y
	}

	set y(new_y) {
		this._y = new_y

		this.position.y = this.object.y + this._y
	}
}
