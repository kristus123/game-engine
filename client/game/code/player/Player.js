export class Player extends Entity {
	constructor(position) {
		super(position)

		this.objects = Objects([
			this.sprite = Sprite.player(D1, this.position),
		])
	}

	update() {
		this.objects.update()
	}
}
