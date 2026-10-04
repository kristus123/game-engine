export class Player extends Entity {
	constructor(position) {
		super(position)

		this.objects = Objects([
			this.sprite = Sprite.player(this.position),
		])

		Light.add(this.position.center, 300)
	}

	get collider() {
		return this.sprite.collider
	}

	update() {
		this.objects.update()
	}
}
