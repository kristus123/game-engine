export class Quest {
	constructor(tasks=[], onQuestCompleted= () => {}) {
		this.index = 0
		this.currentTask = tasks[0]

		this.questCompleted = false

		this.listLooper = new ListLooper(tasks)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.listLooper.goThrough((task, next, loopedThroughAll) => {
			if (loopedThroughAll) {
				this.questCompleted = true
				this.onQuestCompleted()
				console.log('QUEST FINISHED')
				return
			}
			else if (task.completed()) {
				console.log('task completed')
				next()
			}

			task.update()
			task.draw(draw, guiDraw)
		})
	}
}
