export class Bullet extends DynamicGameObject {

	constructor(gun, from, to) {
		super(from, 0, 600)

		this.hit = null
		ForcePush(this).towards(to)
	}

	update() {
		for (const o of this.gun.hittableObjects) {
			if (Collision.between(o, this)) {
				o.onHit()
				List.remove(this.gun.hittableObjects, o)
				List.remove(this.gun.bullets, this)
				break
			}
		}
	}

	draw(draw, guiDraw) {
		draw.new_circle(this, 5)
	}
}
