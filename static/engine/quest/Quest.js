export class Quest {
	constructor(tasks=[]) {
		this.index = 0
		this.currentTask = tasks[0]

		this.questCompleted = false

		this.listLooper = new ListLooper(tasks)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.listLooper.run((task, next, loopedThroughAll) => {
			if (loopedThroughAll) {
				this.questCompleted = true
				console.log("QUEST FINISHED")
				return
			}
			else if (task.completed()) {
				console.log("task complet ed = ")
				next()
			}

			task.update()
			task.draw(draw, guiDraw)
		})
	}
}
