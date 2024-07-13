/*
 *
 * a task is anything that has a completed() method
 *
*/

export class Quest {
	constructor(tasks=[], onQuestCompleted=() => {
		console.log('quest completed')
	}) {

		this.index = 0
		this.currentTask = tasks[this.index]()

		this.questCompleted = false
	}

	update() {
		if (!this.questCompleted) {
			this.currentTask.update()

			if (this.currentTask.completed()) {
				if (!List.lastIndex(this.tasks, this.index)) {
					this.index += 1
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
		if (!this.questCompleted) {
			this.currentTask.draw(draw, guiDraw)
		}
	}
}
