export class MainLevel {
	constructor(levelSelector, world, camera, mouse) {

		this.grid = new Grid(mouse)

		this.runAll = new RunAll([
			this.world,
			new FirstChat(world.npc.position, mouse),
		])

	}

	update() {
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
	}
}
