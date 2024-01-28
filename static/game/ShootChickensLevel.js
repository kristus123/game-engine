export class ShootChickensLevel {
	constructor(world) {
		this.world = world

		this.chicken = new Chicken(world.player)

		this.pisses = Array.from({ length: 20 }, () => this.createRandomPiss(world));

		this.spaceship = new Spaceship(world.player, world.mouse, world.controller)
		this.spaceship.onEnter = () => {
			world.camera.follow(this.spaceship)
			world.camera.zoom = 0.5
			world.controller.control(this.spaceship)
		}
		this.spaceship.onExit = () => {
			world.controller.control(world.player)
			world.camera.follow(world.player)
			world.camera.zoom = 1
		}

		this.runAll = new RunAll([
			world,
			this.spaceship,
			new Npc(),
			// new ThirdChat(npc.position, world.mouse),
			new Gun(world.player, world.mouse),
			this.chicken,
			new Fire(),
		])

		this.chicken.runAll = this.runAll;
	}

	createRandomPiss(world) {
		const x = Random.integerBetween(1000, -1000);
		const y = Random.integerBetween(1000, -1000);
		return new Piss(world.player, world.mouse, new Position(x, y, 100, 100));
	};

	update() {
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
		this.pisses.forEach((piss) => {
			piss.draw(draw)
		})
	}
}
