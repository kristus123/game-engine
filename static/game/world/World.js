export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		const house = new House(this.player)

		this.localObjects = new LocalObjects([
			house,
			this.player,
			new Square(new Position(700, -400), 100, s => {

				s.update = () => {
					
				}

				s.draw = (draw, guiDraw) => {
					if (s.within(400, this.player)) {
						draw.text(s.position.over(), 'yo dude')
					}

					draw.rectangle(s)
				}
			}),
			new Sword(this.player, []),
			new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
		], this)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
