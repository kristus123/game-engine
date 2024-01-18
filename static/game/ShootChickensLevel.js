export class ShootChickensLevel {
	constructor(world) {

		this.chicken = new Chicken(world.player)

		this.spaceship = new Spaceship(world.player, world.mouse, world.controller)
		this.spaceship.onEnter = () => {
			world.camera.follow(this.spaceship)
			world.controller.control(this.spaceship)
		}
		this.spaceship.onExit = () => {
			world.controller.control(world.player)
			world.camera.follow(world.player)
		}

		this.runAll = new RunAll([
			world,
			this.spaceship,
			// npc,
			// new ThirdChat(npc.position, world.mouse),
			new Gun(world.player, world.mouse),
			this.chicken,
			new Fire(),
		])

		this.chicken.runAll = this.runAll
	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
