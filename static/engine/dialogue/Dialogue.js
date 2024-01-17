export class Dialogue {
	constructor(conversation, position, mouse) {
		this.conversation = conversation
		this.position = position
		this.mouse = mouse

		this.textTyper = new TextTyper(conversation.question)
	}

	_drawReplies() {
		if (this.conversation.replies && this.textTyper.finishedTyping) {

			const p = this.position.copy()

			for (const reply of this.conversation.replies) {
				p.y += 120

				if (this.mouse.hovering(p)) {
					Draw.new_text(p, reply.text, 'green')
				}
				else {
					Draw.new_text(p, reply.text)
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

	draw(ctx) {
		this.textTyper.update()
		Draw.new_text(this.position, this.textTyper.typedText)
		this._drawReplies(ctx)
	}
}

class TextTyper {
	constructor(text) {
		this.text = text
		this.currentIndex = 0
		this.isTyping = true
		this.ready = false
	}

	update() {
		if (this.currentIndex < this.text.length) {
			this.currentIndex++
		}
		else {
			this.isTyping = false
		}
	}

	get typedText() {
		return this.text.substring(0, this.currentIndex)
	}

	get finishedTyping() {
		return this.typedText == this.text
	}
}
