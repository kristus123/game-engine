export class SecondChat {
	constructor(position, mouse) {
		this.position = position

		const p = position.copy()
		p.width = 700
		p.height = 100

		this.dialogue = new Dialogue(Conversation('Good job!', [
			Reply('What do i do now?', Conversation('Well, my plan is to head home and watch TV. Bye Kid', [
				Reply('Have fun', Conversation('thanks', [])),
			])),
		]), p, mouse)
	}

	update() {
	}

	draw(ctx) {
		this.dialogue.draw(ctx)
	}
}
