export class Player extends Entity {
	constructor(position) {
		super(position)

		this.objects = Objects([
			this.sprite = Sprite.player(this.position),
			this.s = Light.add(this.collider.center, 900, "255,165,0", 0, 5),
		])
	}

	get collider() {
		return this.sprite.collider
	}

	update() {
		this.objects.update()
	}
}
