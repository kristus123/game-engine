export class Quest {
	constructor(tasks=[]) {
		this.index = 0
		this.currentTask = tasks[0]

		this.questCompleted = false
	}

	update() {
		console.log(this.currentTask.update)

		if (this.currentTask.completed && List.validIndex(this.tasks, this.index+1)) {
			this.index += 1
			this.currentTask = this.tasks[this.index]
		}
	}

	draw(draw, guiDraw) {
		if (!this.currentTask.completed) {
			this.currentTask.draw(draw, guiDraw)
		}
	}
}
