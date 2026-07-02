export class Quest {
	constructor(tasks=[], onQuestCompleted) {
		this.tasks = tasks.map(task => {
			if (task instanceof Task) {
				return task
			}
			return new Task("Legacy Task", {
				start: (markDone) => {
					return task({ markDone })
				}
			})
		})

		this.onQuestCompleted = onQuestCompleted
		this.activeTask = null
		this.lazyLoop = LazyLoop(this.tasks, {
			onNext: (task) => {
				this.activeTask = task
				this.activeTask.start()
			},
			onUpdate: (task) => {
				task.update()
				if (task.done) {
					this.lazyLoop.next()
				}
			},
			onFinish: () => {
				this.activeTask = null
				this.onQuestCompleted?.()
				this.removeItself?.()
			},
		})
	}

	update() {
		this.lazyLoop.update()
	}

}
