export function ResizeObserver(e) {
	const observer = new ResizeObserver(entries => {
		for (let entry of entries) {
			const { width, height } = entry.contentRect
			console.log("Canvas resized:", width, height)

			e.width = width
			e.height = height
		}
	})

	observer.observe(e)
}
