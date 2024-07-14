export class Position {
	constructor(x, y, _width=1, _height=1) {
		this.center = new CenterPosition(this, _width, _height)
	}

	get topLeft() {
		return this.offset(-(this.width/2), -(this.height/2), 20, 20)
	}

	get bottomRight() {
		return this.offset(this.width, this.height, 20, 20)
	}

	set(x=this.x, y=this.y, w=this.width, h=this.height) {
		this.x = x
		this.y = y
		this.width = w
		this.height = h

		return this
	}

	copy() {
		return new Position(this.x, this.y, this.width, this.height)
	}

	offset(x=0, y=0, width=this.width, height=this.height) {
		return new OffsetPosition(this, x, y, width, height)
	}

	over(y=100) {
		return this.offset(this.width/2, -y)
		
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

	behind(anotherPosition, distance) {
		return AnalShit.positionBehind(this, anotherPosition, distance)
	}


	draw(draw, guiDraw) {
		draw.rectangle(this)
	}

}
