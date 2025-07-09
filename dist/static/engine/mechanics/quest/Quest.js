import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 

/*
 *
 * a task is anything that has a lambda that returns something that has a completed() method
 *
*/

export class Quest {
	constructor(tasks=[], onQuestCompleted=() => {}) {

				AssertNotNull(tasks, "argument tasks in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onQuestCompleted, "argument onQuestCompleted in " + this.constructor.name + ".js should not be null")
			
		this.tasks = tasks; 
		this.onQuestCompleted = onQuestCompleted; 


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
