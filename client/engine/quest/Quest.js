export class Quest {
	constructor(tasks=[], onQuestCompleted=() => {}) {
		this.index = 0

		this.activeTask = tasks[this.index]()
	}

	update() {
		if (this.activeTask.completed()) {
			this.index += 1

			if (this.tasks.validIndex(this.index)) {
				this.activeTask = this.tasks[this.index]()
			}
			else {
				this.onQuestCompleted()
				this.removeItself?.()
			}
		}
		else {
			this.activeTask.update()
		}
	}
}
