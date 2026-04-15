export function TestResizeObserver(e, callback) {
	const observer = new ResizeObserver(entries => {
		const entry = entries.assertLength(1)[0]

		callback(entry.contentRect.width, entry.contentRect.height)
	})

	observer.observe(e)
}
