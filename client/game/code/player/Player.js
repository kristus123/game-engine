export class Player extends Entity {
	constructor(position) {
		super(position)

		this.objects = Objects([
			this.sprite = Sprite.player(this.position),
		])
	}

	update() {
		this.objects.update()
	}
}
