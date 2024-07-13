export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.rice = 0
		this.finished = false

		this.main = {
			update: () => {},
			draw: (draw, guiDraw) => {},
		}

		this.localObjects = new LocalObjects([
			new Fire(new Position(0,0)),
			new Quest([
				() => new (class {
					constructor(player) {
						this.player = player
						this.sex = true
					}

					completed() {
						return false
					}

					update() {
						console.log('sexy?')
						console.log(this.player)
					}

					draw(draw, guiDraw) {
					}

				})(this.player)]),
			new Rices(this.player, () => {
				this.main.update = () => {
					console.log('hei')
				}
			}),
			this.player,
			new PicturesLoop(this.player.position.offset(-1000).copy()),
		], this)

	}

	update() {
		this.localObjects.update()
		this.main.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
