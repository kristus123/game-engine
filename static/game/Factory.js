export class Factory extends DynamicGameObject {

	constructor(player) {
		super(new Position(-1500, -300, 150, 150), 100, 10)
		this.player = player
	}

	onFinish() {

	}

	update() {
		if (Collision.between(this.player, this)) {
			Call(this.onFinish)
		}
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
	}
}
