export class Screen {
	static width = window.innerWidth
	static height = window.innerHeight

	static {
		window.addEventListener("resize", Debounce(200, () => {
			console.log(`Window resized to: ${window.innerWidth} x ${window.innerHeight}`)
			this.width = window.innerWidth
			this.height = window.innerHeight
		}))
	}
}
