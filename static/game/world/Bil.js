export class Bil extends DynamicGameObject {
	constructor(player) {
		super(new Position(1200, 0, 600, 300), 10, 10)

		this.picture = new StaticPicture(this.position, '/static/assets/bil.png')
		this.enterVehicle = new EnterVehicle(this, player)
	}

	update() {
		this.enterVehicle.update()
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)
		this.enterVehicle.draw(draw, guiDraw)
	}
}
