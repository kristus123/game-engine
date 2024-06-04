export class DeliverPissLevel {
	constructor(world, npc, level) {

		this.factory = new Factory(world.player)
		this.factory.onFinish = () => {
			console.log('GOOD JOB BOI!')
		}

		this.localObjects = new LocalObjects([
			world,
			npc,
			new SecondChat(npc.position),
			this.factory
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
