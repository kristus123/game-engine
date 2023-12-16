export class Dialogue {
	constructor(text, typingSpeed) {
		this.text = text;
		this.typingSpeed = typingSpeed; // in milliseconds
		this.currentIndex = 0;
		this.isTyping = true;

		this.position = new Position(-400, -400, 100, 100)

		setInterval(() => {
			if (this.isTyping) {
				if (this.currentIndex < this.text.length) {
					this.currentIndex++;
				} else {
					this.isTyping = false;
				}
			}
		}, typingSpeed);
		
	}

	update() {
	}

	draw(ctx) {
		const text = this.text.substring(0, this.currentIndex)

		Draw.new_text(ctx, this.position, text)

		if (!this.isTyping) {
			const p = this.position.copy()
			p.y += 100
			Draw.new_text(ctx, p, 'Yes i love it')
		}
	}
}
