export class Bullet extends DynamicGameObject {

	constructor(gun, from, to) {
		super(from, 0, 3000)

		this.hit = null

		ForcePush(this).towards(to)
	}

	update() {
		for (const o of this.gun.hittableObjects) {
			if (Collision.between(o, this)) {
				this.hit = o
				Call(o.onHit)
			}
		}
	}

	draw(draw, guiDraw) {
		draw.new_circle(this)
	}
}
