export class MainLevel {
	constructor(levelSelector, camera, mouse) {
		this.levelSelector = levelSelector
		this.camera = camera
		this.mouse = mouse
		this.controller = new Controller()

		this.player = new Player(mouse)
		this.camera.follow(this.player)
		this.controller.control(this.player)

		this.spaceship = new Spaceship(mouse)
		this.slingshotExtension = new SlingshotExtension(mouse, this.player)

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


		this.piss = new Piss(this.player, this.mouse),

		this.chat = new FirstChat(this.npc.position, this.piss, mouse)

		this.runAll = new RunAll('mainlevel', [
			this.player,
			this.spaceship,
			this.controller,
			this.npc,
			this.piss,
			this.evilGuy,
			this.chat,
			this.slingshotExtension,
		])
	}

	update() {
		this.levelSelector.changeActiveLevel(new InsideLevel(this.levelSelector, this.camera, this.mouse)) 
		if (this.player.beacon) {

			if (Distance.between(this.player.beacon, this.spaceship) < 200) {
				// this.spaceship.velocity.x = 0
				// this.spaceship.velocity.y = 0

				if (this.slingshotExtension.projectile.connectedTo) {
					Push(this.spaceship).towards(new Position(500, 200), 200)
				}
			}
			else {
				if (!this.slingshotExtension.projectile.connectedTo) {
					Push(this.spaceship).towards(this.player.beacon, 100)
				}

			}
		}

		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
