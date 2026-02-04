export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 400)

		this.localObjects = LocalObjects([
			this.sprite = Sprite.(this.position),
		])
	}

	update() {
		this.localObjects.update()
	}

}
