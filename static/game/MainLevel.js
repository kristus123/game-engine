export class MainLevel {
	constructor(levelSelector, world, camera, mouse) {

		this.runAll = new RunAll([
			this.world,
			new FirstChat(world.npc.position, mouse),
			new AiChat(this.world.deliveryDrone.position, mouse),
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
	}
}
