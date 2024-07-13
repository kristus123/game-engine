export class Bil extends DynamicGameObject {
	constructor(player) {
		super(player.position.offset(200, player.y, 600, 300).copy(), 10, 10)

		this.picture = new StaticPicture(this.position, '/static/assets/bil.png')
		this.enterVehicle = new EnterVehicle(this, player)
		this.enterVehicle.onEnter = () => {
			Call(this.onEnter)
		}
	}

	update() {
		this.enterVehicle.update()
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)
		this.enterVehicle.draw(draw, guiDraw)
	}
}
