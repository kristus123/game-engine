
export class DeliverPissLevel {
	constructor(world, npc, levelSelector) {

		this.factory = new Factory(world.player)


		this.factory.onFinish = () => {
			levelSelector.changeActiveLevel(new ShootChickensLevel(world, npc, levelSelector))
		}

		this.runAll = new RunAll([
			world,
			npc,
			new SecondChat(npc.position, world.mouse),
			this.factory
		])
	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
