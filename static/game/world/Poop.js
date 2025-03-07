export class Poop extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

		this.position.width = 40
		this.position.height = 40

		this.localObjects = new LocalObjects([
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		draw.brown(this)

		if (Mouse.hovering(this)) {
			this.remove()
		}
	}

	remove() {
		Html.fadeaway('poop', this.position)
		G.poop.remove(this)
		G.splash.random(this.position, 'brown')
		HtmlProgressBar.change(3)
		G.money += 1
		Audio.poop()
	}
}
