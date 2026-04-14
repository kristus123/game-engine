export function TestResizeObserver(e, callback) {
	const observer = new ResizeObserver(entries => {
		for (let entry of entries) {
			const { width, height } = entry.contentRect
			console.log("Canvas resized:", width, height)

			callback(width, height)
		}
	})

	observer.observe(e)
}
