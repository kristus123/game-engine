export class Person extends DynamicGameObject {
	constructor(position, player) {
		super(position, 10, 10)
		this.position.width = 170
		this.position.height = 300

		this.picture = new StaticPicture(this.position, '/static/assets/person.png')
		
		this.localObjects = new LocalObjects()
		
		this.text = new MultiTextTyper(this.position.over(), [
			'HJEY!!!',
		], () => {
			this.localObjects.add(new Button(this.position.over(), 'what is it?', b => {
				Html.remove(b)
				this.text = new MultiTextTyper(this.position.over(), [
					'i have some cum',
				], () => {
					this.localObjects.add(new Button(this.position.over(), 'wow really?', b => {
						Html.remove(b)
						this.text = new MultiTextTyper(this.position.over(), [
							'yes sir!',
						])
					}))
				})
			}))
		})
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)

		if (this.within(300, this.player)) {
			this.text.update()
			this.text.draw(draw, guiDraw)
		}
		else {
			draw.text(this.position.over(), '!!!')
		}
	}
}
