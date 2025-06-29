export class Npc extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 3)

		this.button = Html.floating(Html.button('hei', () => {
			Html.hide(this.button)
		}), this.position.over(0))

		const text = new Text(this.position.offset(-200), 'kyss meg ragnar')
		text.hide()

		this.localObjects = new LocalObjects([
			G.Sprite.player(position),
			OnChange(() => this.within(200, G.player), within => {
				within ? text.show() : text.hide()
			}),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
