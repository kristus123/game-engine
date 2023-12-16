export class MainLevel {
	constructor(cameraFollow, mouse) {
		this.mouse = mouse
		this.controller = new Controller(this.player)
		this.player = new Player(mouse, this.controller.keyboard)

		this.spaceship = new Spaceship(mouse)
		this.npc = new Npc(this.player)

		this.extensions = new LoadExtensions(this, [
			new Fleet(this.player),
			new FetchContainerExtension(this.spaceship),
			new EnterVehicleExtension(this.player, this.spaceship, cameraFollow),
			this.npc,
			new Planets(),
		])

		// new Dialogue({
		// 	text: 'do you like pie?',
		// 	choices: [
		// 		{
		// 			answer: 'yes, i love it', 
		// 			then: {
		// 				text: 'do you want pie?',
		// 				choices: [
		// 					{answer: 'yes'},
		// 					{answer: 'no'},
		// 				],
		// 			},
		// 		},
		// 	],
		// })


	}

	update() {
		this.extensions.update()
	}

	draw(ctx) {
		// Draw.new_circle(ctx, this.mouse.position)
		this.extensions.draw(ctx)
		// Draw.new_text(ctx, this.player.position, 'hei')
	}
}
