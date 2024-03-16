export class DeliverPissLevel {
	constructor(world, npc, levelSelector) {

		this.factory = new Factory(world.player)
		this.factory.onFinish = () => {
			console.log('GOOD JOB BOI!')
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

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
