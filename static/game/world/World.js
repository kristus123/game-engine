export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		const house = new House(this.player)

		this.localObjects = new LocalObjects([
			// house,
			new Square(new Position(700, -400), 100, s => {

				s.update = () => {
					
				}

				s.draw = (draw, guiDraw) => {
					if (s.touches(this.player)) {
						draw.text(s.position.over(), 'yo dude')
					}

					draw.rectangle(s)
				}
			}),
			this.player,
			new Sword(this.player, []),
			new CloudParallax(),
			new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
			new PathFinder(new Square(new Position(0,0), 20), new PersistedInvisibleWalls(this.player).walls.objects, this.player)
		], this)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
