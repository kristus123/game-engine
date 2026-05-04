/*
a task is anything that has a lambda that returns something that has a completed() method
it will append a .markTaskComplete() method to be able to mark tasks as completed
 */

export class Quest {
	constructor(tasks=[], onQuestCompleted=() => {}) {

		Assert.method(onQuestCompleted)
		Assert.array(tasks, t => t.assertOfType(Task))

		let index = 0

		this.objects = Objects([
			OnTrue(() => tasks[index].completed, () => {
				index += 1
				if (tasks.validIndex(index)) {
					tasks[index].start()
				}
				else {
					onQuestCompleted()
					this.objects.clear()
				}
			}),
			{
				update: () => {
					tasks[index].update()
				},
			},
		])
	}

	update() {
		this.objects.update()
	}
}
