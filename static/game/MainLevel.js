export class MainLevel {
	constructor(levelSelector, world, camera, mouse) {

		this.grid = new Grid(mouse)

		this.runAll = new RunAll([
			this.world,
			new FirstChat(world.npc.position, mouse),
		])

		setTimeout(() => {
			this.runAll.add(new AiChat(this.world.deliveryDrone.position, mouse))
		}, 30);
	}

	update() {
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
	}
}
