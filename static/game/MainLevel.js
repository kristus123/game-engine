export class MainLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(levelSelector, camera, mouse)

		this.npc = new Npc()
		this.grid = new Grid(mouse)

		this.pissQuest = new PissQuest(this.world)
		this.pissQuest.onFinish = () => {
			this.levelSelector.changeActiveLevel(new ShootChickensLevel(this.world))
		}

		this.levelSelector = levelSelector

		this.runAll = new RunAll([
			this.world,
			this.npc,
			this.pissQuest,
			new FirstChat(this.npc.position, mouse),
			this.grid,
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
	}
}
