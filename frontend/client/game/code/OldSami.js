export class OldSami extends Entity {
	constructor() {
		super(WorldPosition(1000, 2000))

		this.objects = Objects([
			this.sprite = Sprite.oldSami(this.position)
		])
	}

	update() {
		this.objects.update()
	}

}
