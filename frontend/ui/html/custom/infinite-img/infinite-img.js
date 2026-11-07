export default {
	fields: () => ({ resizeObserver: null }),
	onDomAdd: ({ html }) => {
		const track = html.track
		const sizer = html.sizer
		const source = Assert.string(html.getAttribute("src"))
		const speed = html.getAttribute("speed")
		if speed {
			html.style.setProperty("--infinite-img-speed", speed)
		}
		const render = () => {
			const tileWidth = sizer.naturalWidth
			if tileWidth == 0 {
				return
			}

			let countPerLoop = Math.ceil((html.clientWidth || window.innerWidth) / tileWidth) + 1
			if countPerLoop % 2 != 0 {
				countPerLoop++
			}
			if track.children.length == countPerLoop * 2 {
				return
			}
			const images = []
			for let i = 0; i < countPerLoop * 2; i++ {
				const tile = document.createElement("img")
				tile.setAttribute("src", source)
				tile.draggable = false
				if i % 2 == 1 {
					tile.style.transform = "scaleX(-1)"
				}
				images.push(tile)
			}
			track.replaceChildren(...images)
		}
		sizer.addEventListener("load", render, { once: true })
		sizer.setAttribute("src", source)
		render()
		html.fields.resizeObserver?.disconnect()
		html.fields.resizeObserver = new ResizeObserver(render)
		html.fields.resizeObserver.observe(html)
	},
	onDomRemove: ({ html }) => html.fields.resizeObserver?.disconnect(),
}
