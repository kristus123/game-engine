export class OldSami extends Entity {
	constructor(position) {
		super(position)

		this.objects = Objects([
			this.sprite = Sprite.oldSami(this.position)
		])
	}

	update() {
		this.objects.update()
	}

}
