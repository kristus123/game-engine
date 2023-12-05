export class Position {
	constructor(x, y, width, height) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height

		this.center = new CenterPosition(this, width, height)
	}
	
}
