export class Bullet extends DynamicGameObject {

	constructor(from, to) {
		super(new Position(from.x, from.y, 40, 40), 0, 3000)

		this.from = {
			x: from.x,
			y: from.y,
		}
		this.to = to
		this.hit = null

		ForcePush(this).towards(to)
	}

	onCollision(o) {
		if (o instanceof Npc) {
			o.hp -= 30
		}

		this.hit = o
	}

	draw(draw, guiDraw) {
		draw.new_circle(this)
	}
}
