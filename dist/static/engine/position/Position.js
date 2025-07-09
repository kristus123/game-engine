import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { AnalShit } from '/static/engine/position/AnalShit.js'; 
import { CenterPosition } from '/static/engine/position/CenterPosition.js'; 
import { OffsetPosition } from '/static/engine/position/OffsetPosition.js'; 
import { ScreenPosition } from '/static/engine/position/ScreenPosition.js'; 

export class Position {
	constructor(x, y, _width=1, _height=1) {

				AssertNotNull(x, "argument x in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(y, "argument y in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(_width, "argument _width in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(_height, "argument _height in " + this.constructor.name + ".js should not be null")
			
		this.x = x; 
		this.y = y; 
		this._width = _width; 
		this._height = _height; 

		this.center = new CenterPosition(this, _width, _height)
		this.screen = new ScreenPosition(this, _width, _height)
	}

	get topLeft() {
		return this.offset(-(this.width/2), -(this.height/2), 20, 20)
	}

	get bottomRight() {
		return this.offset(this.width, this.height, 20, 20)
	}

	xy(p) {
		this.x = p.x
		this.y = p.y
	}

	set(x=this.x, y=this.y, w=this.width, h=this.height) {
		this.x = x
		this.y = y
		this.width = w
		this.height = h

		return this
	}

	copy(offset_x=0, offset_y=0) {
		return new Position(this.x + offset_x, this.y+offset_y, this.width, this.height)
	}

	offset(offset_x=0, offset_y=0, width=this.width, height=this.height) {
		return new OffsetPosition(this, offset_x, offset_y, width, height)
	}

	over(y=100) {
		return this.offset(this.width/2, -y)
	}

	right(x=100) {
		return this.offset(this.width + x, 0)
	}

	up(amount) {
		this.y + amount
		return this
	}

	left(amount) {
		this.x - amount
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

	resize(amount) {
		this.width += amount
		this.height += amount
	}

	size(width, height) {
		this.width = width
		this.height = height

		return this
	}

	scale(amount) {
		this.width *= amount
		this.height *= amount

		return this
	}

	behind(anotherPosition, distance=200) {
		return AnalShit.positionBehind(this, anotherPosition, distance)
	}


	draw(draw, guiDraw) {
		draw.rectangle(this)
	}

	toJson() {
		return {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
		}
	}

	static from(jsonPosition) {
		return new Position(jsonPosition.x, jsonPosition.y, jsonPosition.width, jsonPosition.height)
	}

}
