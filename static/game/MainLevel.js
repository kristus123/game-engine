export class MainLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(levelSelector, camera, mouse)

		this.npc = new Npc()

		this.levelSelector = levelSelector

		this.taskTracker = new TaskTracker();


		this.piss = new Piss(this.world.player, mouse, new Position(-1000, 100, 100, 100))
		this.piss.onFinish = () => {
			levelSelector.changeActiveLevel(new DeliverPissLevel(this.world, this.npc, levelSelector))
			this.taskTracker.completeTask()
		}

		this.runAll = new RunAll([
			this.world,
			this.npc,
			this.piss,
			new FirstChat(this.npc.position, this.piss, mouse)
		])
	}

	update() {
		if (this.taskTracker.isTaskCompleted())
		{
			this.levelSelector.changeActiveLevel(new ShootChickensLevel(this.world))
			this.runAll.update()
		}
	}

	draw(draw) {
		this.runAll.draw(draw)
	}
}
