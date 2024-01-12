
export class NextLevel {
	constructor(world, npc, levelSelector) {

		this.runAll = new RunAll('NextLevel', [
			world,
			npc,
			new ThirdChat(npc.position, world.mouse),
		])
	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
