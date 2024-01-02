export class DeliverLevel {
	constructor(world, npc) {
		this.runAll = new RunAll('deliverLevel', [
			world,
			npc,
			new SecondChat(npc.position, world.mouse),
		])
	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
