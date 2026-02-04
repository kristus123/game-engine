export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 400)

		this.localObjects = Objects([
			this.sprite = Sprite.(this.position),
		])
	}

	update() {
		this.localObjects.update()
	}

}
