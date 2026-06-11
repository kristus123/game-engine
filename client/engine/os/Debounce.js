export function Debounce(delay = 200, fn) {
	let timeout

	return (...args) => {
		clearTimeout(timeout)
		timeout = setTimeout(() => fn(...args), delay)
	}
}

