export class Player extends Entity {
	constructor(position) {
		super(position)

		this.objects = Objects([
			this.sprite = Sprite.player(this.position),
		])
	}

	get collider() {
		return this.sprite.collider
	}

	update() {
		this.objects.update()
	}
}
