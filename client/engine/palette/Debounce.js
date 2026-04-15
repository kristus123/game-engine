export function Debounce(ms, callback) {
	let debounceTimeout

	window.addEventListener("resize", () => {
		clearTimeout(debounceTimeout)

		debounceTimeout = setTimeout(() => {
			callback()
		}, ms)
	})
}
