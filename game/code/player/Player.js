export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 400)

		this.objects = Objects([
			this.sprite = Sprite.player(this.position),
		])
	}

	update() {
		this.objects.update()
	}

}
