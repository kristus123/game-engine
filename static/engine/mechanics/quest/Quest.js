/*
 *
 * a task is anything that has a lambda that returns something that has a completed() method
 *
*/

export class Quest {
	constructor(tasks=[], onQuestCompleted=() => {}) {

		this.index = 0
		this._setNewCurrentTask(tasks[this.index])

		this.questCompleted = false
	}

	_setNewCurrentTask(task) {
		task = task()

		task.markTaskComplete = () => {
			task.completed = () => true
		}

		this.currentTask = task
	}

	update() {
		if (!this.questCompleted) {
			if (this.currentTask.update) {
				this.currentTask.update()
			}

			if (this.currentTask.completed && this.currentTask.completed()) {
				this.index += 1
				if (List.validIndex(this.tasks, this.index)) {
					this._setNewCurrentTask(this.tasks[this.index])
				}
				else {
					this.questCompleted = true
					this.onQuestCompleted()
				}
			}
		}
	}

	draw(draw) {
		if (!this.questCompleted && this.currentTask.draw) {
			this.currentTask.draw(draw)
		}
	}
}
