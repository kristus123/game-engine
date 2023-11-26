export class Bullet extends GameObject {

	constructor(from, to) {
		super(from.x, from.y, 40, 40, 0, 5000)

		this.from = {
			x: from.x,
			y: from.y,
		}
		this.to = to
		this.hit = null

		Push(this).towards(to)
	}

	onCollision(o) {
		this.hit = o

		if (o instanceof InventoryItem) {
			o.pickUp()
		}
	}

	draw(ctx) {
		if (this.to) {
			Draw.lineBetween(ctx, this.from, this)
		}
	}
}
