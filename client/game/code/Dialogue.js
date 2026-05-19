export class Dialogue {
	constructor(texts) {

		const box = F.talkBubble()

		this.lazyLoop = LazyLoop(texts, {
			onNext: (value) => {
				box.text.textContent = value.text

				box.text.splitLetters().forEach((s, i) => {
					s.animate("fadeIn", {
						variables: {
							delay: (i * 8) + "ms",
						},
						onFinish: () => {
							if (s == box.text.last) {
								this.lazyLoop.next()
							}
						},
					})

				})
			},
			onFinish: () => {
				box.remove()
			},
			onUpdate: (value) => {
				box.worldFloat(WorldPosition(1512, 2100))
			},
		})
	}

	update() {
		this.lazyLoop.update()
	}

}
