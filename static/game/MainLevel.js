export class MainLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(levelSelector, camera, mouse)

		this.npc = new Npc()

		this.levelSelector = levelSelector

		this.pissTaskTracker = new TaskTracker();


		this.pissArray = [
			new Piss(this.world.player, mouse, new Position(-1000, 100, 100, 100)),
			// We can have more piss objects
		  ];
		  
		  this.pissArray.forEach(piss => {
			piss.onFinish = () => {

                        this.pissTaskTracker.completeTask();
			
			levelSelector.changeActiveLevel(new DeliverPissLevel(this.world, this.npc, levelSelector));
			};
		  });


		this.runAll = new RunAll([
			this.world,
			this.npc,
			this.pissArray,
			new FirstChat(this.npc.position, this.pissArray, mouse)
		])
	}

	update() {
		this.levelSelector.changeActiveLevel(new ShootChickensLevel(this.world))
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
	}
}
