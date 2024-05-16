export class Bullet extends DynamicGameObject {

	constructor(gun, from, to) {
		super(from, 0, 3000)

		this.hit = null

		ForcePush(this).towards(to)
	}

	update() {
		for (const o of this.gun.hittableObjects) {
			if (Collision.between(o, this)) {
				o.onHit()
				List.remove(this.gun.Bullets, this)
				break
			}
		}
	}

	draw(draw, guiDraw) {
		draw.new_circle(this)
	}
}
