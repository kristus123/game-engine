import { Draw } from '/static/Draw.js';


export class Circle {
	constructor(x, y, radius, color) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
	}

	draw(ctx) {
		Draw.circle(ctx, this.x, this.y, this.radius, this.color)
	}

	inside(player) {
		const distance = Math.sqrt((player.x + player.width / 2 - this.x)**2 + (player.y + player.height / 2 - this.y)**2);
		return distance <= this.radius;
	}

}
