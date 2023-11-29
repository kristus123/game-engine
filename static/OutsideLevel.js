export class OutsideLevel {
	constructor(player, cameraFollow, mouse) {
		this.player = player
		this.mouse = mouse
		this.gun = new Gun(this.player)

		this.spaceship = new Spaceship()
		this.npc = new Npc(this.player)

		this.splash = new Splash(this.player)

		this.extensions = new LoadExtensions([
			new FetchContainerExtension(this.spaceship, this.npc),
			new EnterVehicleExtension(this.player, this.spaceship, cameraFollow),
			this.npc,
			new Planets(),
			this.splash
		])

		this.animation = new Animation()

		this.pp = new PrettyParticles()

		// setInterval(() => {
		// 	for (let index = 0; index < 1; index++) {
		// 		const x = Random.numberBetween(-1000, 1000)
		// 		const y = Random.numberBetween(-1000, 1000)
		// 		this.player.inventory.addPickable(this.physics.applyPhysics(new InventoryItem(x, y)))
		// 	}
		// }, 500);

		mouse.clickEvents.addOnClick('shoot', mousePosition => {
			this.splash.splash(this.player, mousePosition, undefined, undefined, Random.floatBetween(10, 40))
			this.shot = true

			setTimeout(() => {
				this.shot = false
			}, 100);

			setTimeout(() => {
				Push(this.player).awayFrom(mousePosition, 60)
			}, 100);
		})
	}

	update() {
		this.player.inventory.pickableItems.forEach(i => {
			Push(i).towards(this.player, 50)
		})

		this.extensions.update()
	}

	draw(ctx) {
		Draw.circleSpinning(ctx, this.player, 50)

		this.player.inventory.pickableItems.forEach(i => {
			if (Calculate.withinAngle(this.player, i, this.splash.minAngle, this.splash.maxAngle, 500) && this.shot) {
				setTimeout(() => {
					this.player.inventory.pickUp(i)
				}, 100);
			}
		})

		this.extensions.draw(ctx)

		if (this.animation.active) {
			this.pp.updateAndDraw(ctx, this.player.x, this.player.y)
			Draw.circle(ctx, this.player.x, this.player.y, 10, 'red')
		}
	}
}
