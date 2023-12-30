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

		this.piss_1 = new Piss(this.player, this.mouse, new Position(-1000, 100, 1000, 1000))
		this.piss_1.onFinish = () => {
			Push(this.player).towards(new Position(400, this.player.y), 1000)
		}

		this.chat = new FirstChat(this.npc.position, this.piss_1, mouse)

		this.runAll = new RunAll('mainlevel', [
			new StarBackground(),
			// new Planets(),
			this.player,
			this.controller,
			this.npc,
			this.piss_1,
			this.chat,
			// new Picture(this.npc, '/static/sun.png'),
		])
	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
