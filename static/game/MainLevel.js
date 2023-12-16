export class MainLevel {
	constructor(cameraFollow, mouse) {
		this.mouse = mouse
		this.controller = new Controller(this.player)
		this.player = new Player(mouse, this.controller)

		this.spaceship = new Spaceship(mouse)
		this.npc = new Npc(this.player)

		this.dialogue = new Dialogue('Do you want to enter the spaceship?', [
			{
				key: 'yes',
				text: 'yes, i do', 
				keypress: 'a',
			},
			{
				key: 'no',
				text: 'no. that is scary', 
				keypress: 'b',
			},
		])


		this.extensions = new LoadExtensions(this, [
			this.dialogue,
			new Fleet(this.player),
			new FetchContainerExtension(this.spaceship),
			new EnterVehicleExtension(this.player, this.spaceship, cameraFollow),
			this.npc,
			new Planets(),
		])



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
