export class Dialogue {
	constructor(conversation, position, mouse) {

		this.textTyper = new TextTyper(conversation.question)

		// this.Buttons = this.conversation.replies.map(r => {
		// 	return new Button(position, reply.text, this.mouse).draw(draw, guiDraw)
		// })
	}

	_drawReplies(draw) {
		if (this.conversation.replies && this.textTyper.finishedTyping) {

			const p = this.position.copy()

			for (const reply of this.conversation.replies) {
				p.y += 120

				new Button(p, reply.text, this.mouse).draw(draw)

				// if (this.mouse.hovering(p)) {
				// }
				// else {
				// 	draw.new_text(p, reply.text)
				// }

				if (this.mouse.clicking(p)) {
					this._select(reply)
				}
			}
		}
	}

	_select(reply) {
		this[reply.key] = {
			text: reply.text,
		}

		if (reply.conversation) {
			this.textTyper = new TextTyper(reply.conversation.question)
			this.conversation = reply.conversation
		}
	}

	draw(draw, guiDraw) {
		this.textTyper.update()
		draw.new_text(this.position, this.textTyper.text)
		this._drawReplies(draw)
	}
}
