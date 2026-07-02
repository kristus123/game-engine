export class Quest {
	constructor(tasks=[], onQuestCompleted) {
		this.lazyLoop = LazyLoop(this.tasks, {
			onNext: (task) => task.start(),
			onUpdate: (task) => {
				task.update()
				if (task.done) {
					this.lazyLoop.next()
				}
			},
			onFinish: () => {
				onQuestCompleted?.()
				this.removeItself?.()
			},
		})
	}

	update() {
		this.lazyLoop.update()
	}

}
