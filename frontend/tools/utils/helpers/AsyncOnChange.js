export function AsyncOnChange(condition, action) {
	Assert.method(condition)
	Assert.method(action)

	let lastCondition = Random.uuid()

	return {
		update: async () => {
			const current = await condition()

			console.log(lastCondition)
			console.log(current)
			if (lastCondition != current) {
				console.log("TRIGGERING ONCHANGE")
				action(current)
				lastCondition = current
			}
		}
	}

}
