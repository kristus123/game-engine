export class Quest {
	constructor(tasks=[]) {

		this.index = 0
		this.currentTask = tasks[this.index]()

		this.questCompleted = false

		this.onQuestCompleted = () => {
			console.log('quest finished')
		}
	}

	update() {
		if (!this.questCompleted) {
			this.currentTask.update()

			if (this.currentTask.completed()) {
				if (List.lastIndex(this.tasks, this.index)) {
					this.questCompleted = true
					this.onQuestCompleted()
				}
				else {
					this.index += 1
					this.currentTask = this.tasks[this.index]()
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
