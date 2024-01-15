export class ShootChickensLevel {
	constructor(world) {

		this.chicken = new Chicken(world.player)

		this.runAll = new RunAll([
			world,
			// npc,
			// new ThirdChat(npc.position, world.mouse),
			new Gun(world.player, world.mouse),
			this.chicken,
			new Fire(),
		])

		this.chicken.runAll = this.runAll
	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
