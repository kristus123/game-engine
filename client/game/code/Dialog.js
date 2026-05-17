export class Dialog {
	constructor(texts) {
		Assert.notEmpty(texts)

		const bubble = F.talkBubble()

		const stopWatch = StopWatch()

		this.lazyLoop = LazyLoop(texts, {
			onNext: (value) => {
				bubble.text.textContent = value.text
			},
			onFinish: () => {
				bubble.remove()
			},
			onUpdate: (value) => {
				if (stopWatch.moreThan(value.sleepEnd)) {
					stopWatch.restart()
					this.lazyLoop.next()
				}
				else {
					bubble.worldFloat(WorldPosition(1512, 2100))
				}
			},
		})
	}

	update() {
		this.lazyLoop.update()
	}

}
