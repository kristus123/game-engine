export class Dialogue {
	constructor(position, texts) {

		const box = F.talkBubble()
		this.completed = false

		this.lazyLoop = LazyLoop(texts, {
			onNext: (value) => {
				box.text.textContent = value.text

				box.text.splitLetters().forEach((s, i) => {
					s.animate("fadeIn", {
						variables: {
							delay: (i * 100) + "ms",
						},
						onEnd: () => {
							if (s == box.text.last) {
								setTimeout(() => {
									this.lazyLoop.next()
								}, 1000)
							}
						},
					})

				})
			},
			onFinish: () => {
				box.remove()
				this.completed = true
			},
			onUpdate: (value) => {
				box.worldFloat(this.position)
			},
		})
	}

	update() {
		this.lazyLoop.update()
	}

}
