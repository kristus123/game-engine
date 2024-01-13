export class ShootChickensLevel {
	constructor(world, npc) {

		this.runAll = new RunAll([
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
