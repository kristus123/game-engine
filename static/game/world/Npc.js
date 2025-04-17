export class Npc extends DynamicGameObject {
	constructor(position, picture='/static/assets/old_man.png') {
		super(position, 100, 100)
		this.picture = new StaticPicture(position, picture)
	}

	update() {
		this.picture.update()
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)

		if (Mouse.hovering(this)) {
			draw.text(this.position.over(50), 'hei')
			
		}
	}
}
