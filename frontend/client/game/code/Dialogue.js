export class Dialogue {
	constructor(texts, onDone = () => {}) {

		const box = Dom.add(Html.talkBubble())
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
								}, value.sleepEnd ?? 1000)
							}
						},
					})
				})
			},
			onFinish: () => {
				Dom.remove(box)
				this.done = true
				onDone()
			},
			onUpdate: (value) => {
				box.worldPosition(value.position)
			},
		})
	}

	update() {
		this.lazyLoop.update()
	}

}
