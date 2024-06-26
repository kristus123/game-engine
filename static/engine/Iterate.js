export function Iterate(amount, run) {
	list = []

	for (let i = 0; i <= amount; i++) {
		list.push(run(i))
	}

	return list
}
