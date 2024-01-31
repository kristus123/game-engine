export class FirstChat {
	constructor(position, mouse) {
		this.position = position

		const p = position.copy()
		p.width = 700
		p.height = 100

		const howToPlay = Reply(
			'Wait, how do i move around?', Conversation('Press \'e\' to dash, the rest should be obvious', []))

		const yes = Reply('yes i look forward to it',
			Conversation('Thats good to hear. hopefully you will not do anything stupid', [
				Reply('ok!', Conversation('Great. Now, get to work!', [howToPlay]), 'ok')
			]),
		)

		const no = Reply('No. this was not what i want to do',
			Conversation('Well, too bad ', [
				Reply('frick!', Conversation('Well.. Bye kid. Get to work...', [howToPlay]))
			]))

		this.dialogue = new Dialogue(Conversation('Welcome Chump. Are you ready to cleanse your local area from piss?', [yes, no]), p, mouse)
	}

	update() {
	}

	draw(draw) {
		this.dialogue.draw(draw)
	}
}
