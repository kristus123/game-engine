
export class MainLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(levelSelector, camera, mouse)

		this.npc = new Npc()

		this.levelSelector = levelSelector;

		this.piss = new Piss(this.world.player, mouse, new Position(-1000, 100, 100, 100))
		this.piss.onFinish = () => {
			levelSelector.changeActiveLevel(new DeliverLevel(this.world, this.npc, levelSelector))
		}


		this.runAll = new RunAll('mainlevel', [
			this.world,
			this.npc,
			this.piss,
			new FirstChat(this.npc.position, this.piss, mouse)
		])
	}

	update() {
		this.runAll.update()
		this.levelSelector.changeActiveLevel(new NextLevel(this.world, this.npc, this.levelSelector))

	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
