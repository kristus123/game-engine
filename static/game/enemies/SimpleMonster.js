export class SimpleMonster extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

		this.position.width = 30
		this.position.height = 20

		this.hunger = 50

		this.localObjects = new LocalObjects([
			new HorizontalSprite(this.position, '/static/assets/blob_57x32.png'),
		])

		this.ranch = null
	}

	update() {
		this.localObjects.update()

		this.hunger -= 0.1
		if (this.hunger < 0) {
			this.removeFromLoop()
		}

		if (Random.percentageChance(100)) {
			G.poop.add(new Poop(this.position.copy()))
		}

		const ranch = this.touchesAny(G.ranches)
		if (ranch) {
			ranch.add(this)
			this.ranch = ranch
		}

		if (Mouse.holdAndMove(this)) {
			
		}
	}

	draw(draw, guiDraw) {
		// draw.hpBar(this.position.over(), this.hunger, 100)
		this.localObjects.draw(draw, guiDraw)
		draw.green(this)

		if (this.hunger < 0) {
			this.velocity.reset()
			draw.red(this.poop)
		}

		if (Mouse.hovering(this)) {
			draw.text(this.position, 'click to move')
		}
		else if (this.ranch && this.touches(this.ranch)) {
			draw.text(this.position, 'happy')
		}
		else {
			draw.text(this.position, 'sad')
		}
	}
}
