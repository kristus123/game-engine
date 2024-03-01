export class AiChat {
	constructor(position, mouse) {
		const p = position.offset(-300, -100)
		p.width = 700
		p.height = 100

		const howToPlay = Reply(
			'Wait, how do i move around?', Conversation('Press \'e\' to dash, the rest should be obvious', []))

		const yes = Reply('Too much',
			Conversation('People have to stop throwing their piss directly out in space', [
				Reply('ok!', Conversation('Great. Now, get to work!', []))
			]),
		)

		const no = Reply('Why is there so much piss here?',
			Conversation('People have to stop throwing their piss directly out in space', [
				Reply('I think everyone does it', Conversation('Unfortunately', []))
			]),
		)

		this.dialogue = new Dialogue(Conversation('quite a lot of piss around i must say', [yes, no]), p, mouse)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.dialogue.draw(draw, guiDraw)
	}
}
