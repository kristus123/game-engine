export class MainLevel {
	constructor(levelSelector, world, camera, mouse) {

		this.pissQuest = new PissQuest(this.world)

		this.runAll = new RunAll([
			this.world,
			this.pissQuest,
		])

		const chat = this.runAll.add(new FirstChat(world.npc.position, mouse))
		chat.onFinish = () => {
			setTimeout(() => {
				this.runAll.add(new AiChat(this.world.deliveryDrone.position, mouse))
				this.runAll.remove(chat)
			}, 10_000);
		}

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
