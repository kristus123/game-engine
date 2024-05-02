export class MainLevel {
	constructor(levelSelector, allGameObjects, world, camera, mouse) {

		// const pissQuest = new PissQuest(this.world.deliveryDrone, mouse)
		// pissQuest.onFinish = () => {
		// 	levelSelector.changeActiveLevel(new DeliverPissLevel(world, this.world.npc, levelSelector))
		// }

		// this.runAll = new RunAll([
			// this.world,
			// pissQuest,
		// ])
		// allGameObjects.add(world)

		// ObjectPersistence.get().forEach(o => {
		// 	this.runAll.add(o)
		// 	o.onCollision = x => {
		// 		Push(o).awayFrom(x)
		// 	}
		// })

		// const chat = this.runAll.add(new FirstChat(world.npc.position, mouse))
		// chat.onFinish = () => {
		// 	setTimeout(() => {
		// 		this.runAll.add(new AiChat(this.world.deliveryDrone.position, mouse))
		// 		this.runAll.remove(chat)
		// 	}, 10_000)
		// }
	}

	update() {
		// console.log(Distance.between(this.world.player, this.world.deliveryDrone))
		// this.runAll.update()
	}

	draw(draw, guiDraw) {
		// this.runAll.draw(draw, guiDraw)
	}
}
