export class Dialogue {
	constructor(conversation, dialoguePosition) {

		this.replyPosition = dialoguePosition

		this.textTyper = new TextTyper(conversation.question)
	}

	_drawReplies(draw) {
		if (this.conversation.replies && this.textTyper.finishedTyping) {

			const p = this.replyPosition.copy()

			for (const reply of this.conversation.replies) {
				p.y += 120

				new Button(p, reply.text).draw(draw)

				if (Mouse.clicked(p)) {
					this[reply.key] = {
						text: reply.text,
					}

					if (reply.conversation) {
						this.textTyper = new TextTyper(reply.conversation.question)
						this.conversation = reply.conversation
					}
				}
			}
		}
	}

	draw(draw, guiDraw) {
		this.textTyper.update()
		draw.new_text(this.dialoguePosition, this.textTyper.text)
		this._drawReplies(draw)
	}
}
