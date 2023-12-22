export class MainLevel {
	constructor(camera, mouse) {
		this.mouse = mouse
		this.controller = new Controller(this.player)

		this.player = new Player(mouse, this.controller)
		camera.follow(this.player)

		this.npc = new Npc()
		this.evilGuy = new Npc()
		this.evilGuy.x -= 1000
		this.evilGuy.draw = (ctx) => {
			if (Distance.between(this.player, this.evilGuy) < 500) {
				Push(this.evilGuy).towards(this.player, 20)
				const p = this.evilGuy.position.copy()
				p.y -= 100
				Draw.new_text(ctx, p, 'get back to work')
			}

			if (Distance.between(this.player, this.evilGuy) < 50) {
				Push(this.player).towards(this.npc, 200)
			}
		}

		this.controller.control(this.player)

		this.piss = new Piss(this.player, this.mouse),

		this.chat = new FirstChat(this.npc.position, this.piss, mouse)

		this.runAll = new RunAll('mainlevel', [
			this.player,
			this.controller,
			this.npc,
			this.piss,
			this.evilGuy,
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
