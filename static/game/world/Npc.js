export class Npc extends DynamicGameObject {
	constructor(position, picture='/static/assets/old_man.png') {
		super(position, 100, 100)
		this.picture = new Picture(position, picture)

		this.button = Html.floating(Html.button('hei'), this.position.over(100))

		setInterval(() => {
			Html.changeText(this.button, this.button.textContent += '.')
		}, 1000)

		const text = new Text(this.position.offset(-200), 'kyss meg ragnar')

		this.localObjects = new LocalObjects([

			OnChange(() => this.within(200, G.player), within => {
				if (within) {
					text.show()
				}
				else {
					text.hide()
				}
			}),

		])
	}


	update() {
		this.localObjects.update()
		this.picture.update()

		Html.floatingPosition(this.button, this.position.offset(-30, -250))

		this.x -= 2

	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)

		if (Mouse.hovering(this)) {
			draw.text(this.position.over(50), 'hei')
		}


		this.localObjects.draw(draw, guiDraw)
	}
}
