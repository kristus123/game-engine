export function AbortAtMs(ms) {
	const a = new AbortController()
	const timer = setTimeout(() => {
		a.abort()
	}, ms)

	return a.signal
}
