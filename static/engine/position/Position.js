export class Position {
	constructor(x, y, width=0, height=0) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height

		this.center = new CenterPosition(this, width, height)
	}
	
}
