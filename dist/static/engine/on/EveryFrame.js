
const counters = new Map()


export function EveryFrame(interval, callback) {
	if (!counters.has(interval)) {
		counters.set(interval, 0)
	}

	let count = counters.get(interval) + 1

	if (count >= interval) {
		count = 0
		callback()
	}

	counters.set(interval, count)
}

