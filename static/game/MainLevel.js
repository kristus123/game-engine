export class MainLevel {
	constructor(levelSelector, camera, mouse) {
		this.levelSelector = levelSelector
		this.camera = camera
		this.mouse = mouse
		this.controller = new Controller()

		this.player = new Player(mouse)
		this.camera.follow(this.player)
		this.controller.control(this.player)

		this.npc = new Npc()

		this.piss_1 = new Piss(this.player, this.mouse, 100)
		this.piss_1.onFinish = () => {
			Push(this.player).towards(new Position(400, this.player.y), 1000)
		}

		this.piss_2 = new Piss(this.player, this.mouse, 2000)
		this.piss_2.onFinish = () => {
			Push(this.player).towards(new Position(5000, this.player.y), 1000)
		}

		this.chat = new FirstChat(this.npc.position, this.piss_1, mouse)

		this.runAll = new RunAll('mainlevel', [
			new StarBackground(),
			this.player,
			this.controller,
			this.npc,
			this.piss_1,
			this.piss_2,
			this.chat,
		])
	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
