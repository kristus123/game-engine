export class Dialogue {
	constructor(defaultPosition, texts) {

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
				box.worldFloat(value.position ?? this.defaultPosition)
			},
		})
	}

	update() {
		this.lazyLoop.update()
	}

}
