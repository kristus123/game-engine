export function Iterate(amount, run) {
	const list = []

	for (let i = 1; i <= amount; i++) {
		list.push(run(i))
	}

	return list
}
