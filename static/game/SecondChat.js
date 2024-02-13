export class SecondChat {
	constructor(position, mouse) {
		const p = position.copy()
		p.width = 700
		p.height = 100

		this.dialogue = new Dialogue(Conversation('Good job!', [
			Reply('What do i do now?', Conversation('Well, my plan is to head home and watch TV. Bye Kid', [
				Reply('What about me?', Conversation('Go back to the factory and deliver your load', [])),
			])),
		]), p, mouse)
	}

	update() {
	}

	draw(draw) {
		this.dialogue.draw(draw)
	}
}
