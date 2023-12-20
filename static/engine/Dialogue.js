export class Dialogue {
	constructor(question, replies, position, mouse) {
		this.question = question
		this.replies = replies
		this.position = position
		this.mouse = mouse

		this.currentIndex = 0
		this.isTyping = true

		setInterval(() => {
			if (this.isTyping) {
				if (this.currentIndex < this.question.length) {
					this.currentIndex++
				}
				else {
					this.isTyping = false
				}
			}
		}, 20)

		const keypressEvent = new KeypressEvent()

		for (const reply of replies) {
			keypressEvent.addKeyDownListener(reply.keypress, () => {
				this.text = reply.text
				this[reply.key] = true
				this.nextDialogue = reply.nextDialogue
			})
		}
	}

	update() {
	}

	draw(ctx) {
		if (this.text) {
			Draw.new_text(ctx, this.position, this.text)
		}
		else {
			const question = this.question.substring(0, this.currentIndex)
			Draw.new_text(ctx, this.position, question)
		}

		if (!this.isTyping && !this.text) {
			const p = this.position.copy()
			for (const reply of this.replies) {
				p.y += 120
				if (this.mouse.hovering(p)) {
					Draw.new_text(ctx, p, reply.keypress + ') ' + reply.text, 'green')
				}
				else {
					Draw.new_text(ctx, p, reply.keypress + ') ' + reply.text)
				}
			}
		}
	}
}
