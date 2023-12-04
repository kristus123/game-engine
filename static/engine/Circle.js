export class Circle {
	constructor() {
		this.x = 100
		this.y = 100
	}

	draw(ctx) {
		if (Distance.withinRadius(this, this.player, 50)) {
			Draw.hollowCircle(ctx, x, y, 50, 'green')
		}
		else {
			Draw.circle(ctx, x, y, 50, 'orange')
		}
		
	}
	
}
