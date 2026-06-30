export function TestResizeObserver(e, callback) {

	const observer = new ResizeObserver(entries => {
		const array = Array.from(entries)
		if (array.length !== 1) {
			throw new Error("length mismash")
		}
		const entry = array[0]

		callback(entry.contentRect.width, entry.contentRect.height)
	})

	observer.observe(e)
}
