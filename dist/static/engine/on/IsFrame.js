
const counters = new Map()

export function IsFrame(interval) {
	if (!counters.has(interval)) {
		counters.set(interval, 0)
	}

	let count = counters.get(interval) + 1
	counters.set(interval, count)

	return count >= interval
}

