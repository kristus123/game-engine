export class Npc extends DynamicGameObject {
	constructor(position, picture='/static/assets/old_man.png') {
		super(position, 10, 3)
		this.picture = new Picture(position, picture)

		this.button = Html.floating(Html.button('hei', () => {
			Html.hide(this.button)
			
		}), this.position.over(0))

		setInterval(() => {
			Html.changeText(this.button, this.button.textContent += '.')
		}, 1000)

		const text = new Text(this.position.offset(-200), 'kyss meg ragnar')
		text.hide()

		this.localObjects = new LocalObjects([
			OnChange(() => this.within(200, G.player), within => {
				within ? text.show() : text.hide()
			}),
		])
	}

	update() {
		this.localObjects.update()
		this.picture.update()
		// Html.floatingPosition(this.button, this.position.offset(0, 0))
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)
		this.localObjects.draw(draw, guiDraw)
	}
}
