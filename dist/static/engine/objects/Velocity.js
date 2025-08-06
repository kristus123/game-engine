import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Position } from '/static/engine/core/position/Position.js'; 

export class Velocity {
	constructor(object, _x=0, _y=0) {

				AssertNotNull(object, "argument object in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(_x, "argument _x in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(_y, "argument _y in " + this.constructor.name + ".js should not be null")
			
		this.object = object; 
		this._x = _x; 
		this._y = _y; 

		this.position = new Position(0, 0)
	}

	oppositePosition() {
		return new Velocity(this.object, -this._x, -this._y)
	}

	draw(draw, guiDraw) {
		draw.circle(this.object.x + this._x, this.object.y + this._y, 10, 'orange')
	}

	reset() {
		this._x = 0
		this._y = 0
	}

	random(amount=10) {
		this._x += Random.integerBetween(-amount, amount)
		this._y += Random.integerBetween(-amount, amount)
	}

	rotate(angleDegrees) {
		const angleRadians = angleDegrees * (Math.PI / 180)
		const cosTheta = Math.cos(angleRadians)
		const sinTheta = Math.sin(angleRadians)

		const newX = this._x * cosTheta - this._y * sinTheta
		const newY = this._x * sinTheta + this._y * cosTheta

		this._x = newX
		this._y = newY
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
