
export class DeliverLevel {
	constructor(world, npc, levelSelector) {

		this.factory = new Factory(world.player)


		this.factory.onFinish = () => {
			levelSelector.changeActiveLevel(new NextLevel(world, npc, levelSelector))
		}

		this.runAll = new RunAll('deliverLevel', [
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
