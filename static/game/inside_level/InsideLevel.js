export class InsideLevel {
	constructor(levelSelector, camera, mouse) {
		this.levelSelector = levelSelector
		this.mouse = mouse
		this.controller = new Controller()

		this.player = new Player(mouse)
		camera.follow(this.player)

		this.controller.control(this.player)

		this.runAll = new RunAll([
			this.player,
			VoidDialogue(this.player, this.mouse),
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
	}
}
