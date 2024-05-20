export class MainLevel {
	constructor(level, allObjects, world, camera, mouse) {

		// const pissQuest = new PissQuest(this.world.deliveryDrone, mouse)
		// pissQuest.onFinish = () => {
		// 	level.change(new DeliverPissLevel(world, this.world.npc, level))
		// }

		// this.localObjects = new LocalObjects([
		// this.world,
		// pissQuest,
		// ])
		// allObjects.add(world)

		// ObjectPersistence.get().forEach(o => {
		// 	this.localObjects.add(o)
		// 	o.onCollision = x => {
		// 		Push(o).awayFrom(x)
		// 	}
		// })

		// const chat = this.localObjects.add(new FirstChat(world.npc.position, mouse))
		// chat.onFinish = () => {
		// 	setTimeout(() => {
		// 		this.localObjects.add(new AiChat(this.world.deliveryDrone.position, mouse))
		// 		this.localObjects.remove(chat)
		// 	}, 10_000)
		// }
	}

	update() {
		// console.log(Distance.between(this.world.player, this.world.deliveryDrone))
		// this.localObjects.update()
	}

	draw(draw, guiDraw) {
		// this.localObjects.draw(draw, guiDraw)
	}
}
