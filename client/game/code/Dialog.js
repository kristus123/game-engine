export class Dialog {
	constructor(xxx, onFinish = () => {}) {

		this.talkBubble = F.talkBubble()

		const stopWatch = StopWatch().start()

		this.texts = ListLooper(xxx, ({ text, sleepEnd }, next) => {
			if (stopWatch.moreThan(sleepEnd)) {
				stopWatch.restart()
				next()
			}
			else {
				this.talkBubble.text.textContent = text
				this.talkBubble.worldFloat(WorldPosition(1512, 2100))
			}
		}, () => {
			this.talkBubble.remove()
			onFinish()
			this.removeItself()
		})
	}

	update() {
		this.texts.update()
	}

}
