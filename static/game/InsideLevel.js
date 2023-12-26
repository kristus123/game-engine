export class InsideLevel {
	constructor(levelSelector, camera, mouse) {
		this.levelSelector = levelSelector
		this.mouse = mouse
		this.controller = new Controller(this.player)

		this.player = new Player(mouse, this.controller)
		camera.follow(this.player)
		this.controller.control(this.player)

		this.runAll = new RunAll('mainlevel', [
			this.player
		])
	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
