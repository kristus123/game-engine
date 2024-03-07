export class MainLevel {
	constructor(levelSelector, world, camera, mouse) {

		this.pissQuest = new PissQuest(this.world)

		this.runAll = new RunAll([
			this.world,
			this.pissQuest,
			new FirstChat(world.npc.position, mouse),
			// new AiChat(this.world.deliveryDrone.position, mouse),
		])

		this.pissQuest.onFinish = () => {
			levelSelector.changeActiveLevel(new DeliverPissLevel(world, this.world.npc, levelSelector))
		}
	}

	update() {
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
