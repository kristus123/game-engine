
export class MainLevel {
	constructor(levelSelector, camera, mouse) {
		this.world=new World(levelSelector,camera,mouse)

		this.npc = new Npc()
		this.piss = new Piss(this.world.player, mouse, new Position(-1000, 100, 100, 100))

		this.piss.onFinish = () => {
		// Push(this.player).towards(new Position(400, this.player.y), 1000)

		}

		this.chat = new FirstChat(this.npc.position, this.piss, mouse)


		this.runAll = new RunAll('mainlevel', [
			this.npc,this.piss,this.world,this.chat
		])



	}




	update() {
	
		this.runAll.update()
		
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
