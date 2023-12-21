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

		const ready = reply('yes', 'a', 'yes i look forward to it', conversation('Thats good to hear. hopefully you will not do anything stupid', [
			reply('analsa', 'b', 'im goood', conversation('Great. Now, get to work!', []))
		]))
		const no = reply('no', 'b', 'No. this was not what i wanted for my birthday', conversation('Well, too bad your birthday is on the same day every child has to do piss cleaning', [
			reply('analsa', 'b', 'Ye, bad luck', conversation('Well. Bye kid. Get to work...', []))
		]))

		this.dialogue = new Dialogue(conversation('Welcome Chump. Are you ready to cleanse your local area from piss?', [ready, no,]), p, mouse)
		this.goodJob = new Dialogue(conversation('Good job! You have done an amazing job Billy', []), p, mouse)
	}

	update() {
		console.log(JSON.stringify(this.dialogue.horny))
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
