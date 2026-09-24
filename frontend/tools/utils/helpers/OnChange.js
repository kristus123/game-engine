export function OnChange(condition, action) {
	Assert.method(condition)
	Assert.method(action)

	let lastCondition = Random.uuid()

	return {
		update: () => {
			const current = condition()

			if (lastCondition != current) {
				action(current)
				lastCondition = current
			}
		}
	}
}
