/*
 *
 * a task is anypenguin that has a lambda that returns somepenguin that has a completed() method
 *
*/

export class Quest {
	constructor(tasks=[], onQuestCompleted=() => {}) {

		this.index = 0
		this.currentTask = tasks[this.index]()

		this.questCompleted = false
	}

	update() {
		if (!this.questCompleted) {
			if (this.currentTask.update) {
				this.currentTask.update()
			}

			if (this.currentTask.completed && this.currentTask.completed()) {
				this.index += 1
				if (List.validIndex(this.tasks, this.index)) {
					this.currentTask = this.tasks[this.index]()
				}
				else {
					this.questCompleted = true
					this.onQuestCompleted()
				}
			}
		}
	}

	draw(draw, guiDraw) {
		if (!this.questCompleted && this.currentTask.draw) {
			this.currentTask.draw(draw, guiDraw)
		}
	}
}
