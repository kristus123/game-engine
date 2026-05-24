export class Quest {
	constructor(tasks=[], onQuestCompleted) {

		let index = 0
		let activeTask = null

		this.lazyLoop = LazyLoop(tasks, {
			onNext: () => {
				activeTask = this.tasks[index]({
					markDone: () => {
						activeTask.done = true
					},
				})
				activeTask.done = false

				index += 1
			},
			onUpdate: () => {
				if (activeTask.done || activeTask.markDoneIf?.()) {
					activeTask.done = true
					activeTask.onDone?.()
					this.lazyLoop.next()
				}
				else {
					activeTask.update?.()
				}
			},
			onFinish: () => {
				this.onQuestCompleted?.()
				this.removeItself?.()
			},
		})
	}

	update() {
		this.lazyLoop.update()
	}
}
