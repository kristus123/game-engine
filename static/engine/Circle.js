export class Circle {
	constructor(position) {
		this.position = position
	}

	draw(ctx) {
		Draw.new_circle(ctx, this.position)
	}
	
}
