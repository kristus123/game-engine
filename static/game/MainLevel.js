export class MainLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(levelSelector, camera, mouse)

		this.npc = new Npc()

		this.piss = new Piss(this.world.player, mouse, new Position(-1000, 100, 100, 100))
		this.piss.onFinish = () => {
			levelSelector.changeActiveLevel(new DeliverLevel(this.world, this.npc))
		}

		this.runAll = new RunAll('mainlevel', [
			this.world,
			this.npc,
			this.piss,
			new FirstChat(this.npc.position, this.piss, mouse),
			new Sprite(),
		])

		Draw.sprite()
	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
