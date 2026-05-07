export class Quest {
	constructor(tasks=[], onQuestCompleted=() => {}) {

		Assert.method(onQuestCompleted)
		Assert.array(tasks, t => t.assertOfType(Task))

		this.index = 0
	}

	update() {
		tasks[this.index].update()

		if (tasks[this.index].completed) {
			this.index += 1
			if (tasks.validIndex(this.index)) {
				tasks[this.index].start()
			}
			else {
				onQuestCompleted()
				this.removeItself()
			}
		}
	}
}
