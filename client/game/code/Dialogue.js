export class Dialogue {
	constructor(defaultPosition, texts, onDone = () => {}) {

		const box = F.talkBubble()
		this.done = false

		this.lazyLoop = LazyLoop(texts, {
			onNext: (value) => {
				const template = document.createElement("template")
				template.innerHTML = value.text

				const node = template.content.cloneNode(true)

				// box.text.textContent = node
				box.text.innerHTML = ""
				box.text.appendChild(node)

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
				this.done = true
				onDone()
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
