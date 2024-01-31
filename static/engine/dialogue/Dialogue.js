export class Dialogue {
	constructor(conversation, position, mouse) {
		this.conversation = conversation
		this.position = position
		this.mouse = mouse

		this.textTyper = new TextTyper(conversation.question)
	}

	_drawReplies(draw) {
		if (this.conversation.replies && this.textTyper.finishedTyping) {

			const p = this.position.copy()

			for (const reply of this.conversation.replies) {
				p.y += 120

				if (this.mouse.hovering(p)) {
					draw.new_text(p, reply.text, 'green')
				}
				else {
					draw.new_text(p, reply.text)
				}

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

	draw(draw) {
		this.textTyper.update()
		draw.new_text(this.position, this.textTyper.text)
		this._drawReplies(draw)
	}
}
