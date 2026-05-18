export class Dialogue {
	constructor(texts) {
		Assert.notEmpty(texts)

		const bubble = F.talkBubble()

		this.lazyLoop = LazyLoop(texts, {
			onNext: (value) => {
				bubble.text.textContent = value.text
				const text = bubble.text

				text.splitLetters().forEach((s, i) => {
					s.animate("fadeIn", {
						variables: {
							delay: (i * 8) + "ms",
						},
						onFinish: () => {
							if (s == text.last) {
								this.lazyLoop.next()
							}
						},
					})

				})
			},
			onFinish: () => {
				bubble.remove()
			},
			onUpdate: (value) => {
				bubble.worldFloat(WorldPosition(1512, 2100))
			},
		})
	}

	update() {
		this.lazyLoop.update()
	}

}
