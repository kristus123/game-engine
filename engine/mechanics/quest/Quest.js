/*
 *
 * a task is anything that has a lambda that returns something that has a completed() method
 * it will append a .markTaskComplete() method to be able to mark tasks as completed
 *
*/

export class Quest {
	constructor(tasks=[], onQuestCompleted=() => {}) {
		Assert.array(tasks)

		for (const task of tasks) {
			if (not.method(task)) {
				throw new Error('Quest.js expects a list of arrow functions')
			}
		}

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
				if (this.tasks.validIndex(this.index)) {
					this._setNewCurrentTask(this.tasks[this.index])
				}
				else {
					this.questCompleted = true
					this.onQuestCompleted()
				}
			}
		}
	}
}
