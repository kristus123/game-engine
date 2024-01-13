export class NextLevel {
	constructor(world, npc) {

		this.runAll = new RunAll('NextLevel', [
			world,
			// npc,
			// new ThirdChat(npc.position, world.mouse),
			// new Gun(world.player, world.mouse),
			// new Chicken(),
		])
	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
