function conversation(question, replies) {
	return {
		question: question, 
		replies: replies,
	}
}

function reply(key, keypress, text, conversation) {
	return {
		key: key, 
		keypress: keypress, 
		text: text,
		conversation: conversation,
	}
}

export class FirstChat {
	constructor(position, piss, mouse) {
		this.position = position
		this.piss = piss

		const p = position.copy()
		p.width = 700
		p.height = 100

		const howToPlay = reply('a', 'a', 'Wait, how do i move around?', conversation('Press \'e\' to dash, the rest should be obvious', []))

		const ready = reply('yes', 'a', 'yes i look forward to it',
			conversation('Thats good to hear. hopefully you will not do anything stupid', [
				reply('finish', 'b', 'ok!', conversation('Great. Now, get to work!', [howToPlay]))
			]),
		)

		const no = reply('no', 'b', 'No. this was not what i want to do', conversation('Well, too bad ', [
			reply('finish', 'b', 'frick!', conversation('Well.. Bye kid. Get to work...', [howToPlay]))
		]))
		this.dialogue = new Dialogue(conversation('Welcome Chump. Are you ready to cleanse your local area from piss?', [ready, no]), p, mouse)

		this.goodJob = new Dialogue(conversation('Good job! You have done an amazing job Billy', [
			reply('whatNow', 'a', 'What now?', conversation('press b to place a beacon. a ship will come pick you up', []))
		]), p, mouse)
	}

	update() {
	}

	draw(ctx) {
		if (this.piss.finished) {
			this.goodJob.draw(ctx)
		}
		else {
			this.dialogue.draw(ctx)
		}
	}
}
