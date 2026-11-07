function resolveSource(source) {
	try {
		return AssetPaths.resolveImageSource(source)
	}
	catch (error) {
		const reference = source.match(/^png\.(.*)$/i)
		if !reference {
			throw error
		}

		const matches = AssetPaths.aseprite.filter(path => path.endsWith("/" + reference[1]))
		Assert.true(matches.length == 1, `Aseprite image not found or ambiguous: ${source}`)
		return matches[0] + ".png"
	}
}

export default {
	fields: () => ({ resizeObserver: null }),
	onDomAdd: ({ html }) => {
		const track = html.querySelector(".track")
		const sizer = html.querySelector(".sizer")
		const source = Assert.string(html.getAttribute("src"))
		const imageSource = resolveSource(source)
		const fitAttribute = ["stretch", "cover", "contain"].find(attribute => html.hasAttribute(attribute))
		const scale = Number(html.getAttribute("scale") ?? "1")
		Assert.true(Number.isInteger(scale) && scale > 0, "infinite-img scale must be a positive integer")
		const speed = html.getAttribute("speed")
		if speed {
			html.style.setProperty("--infinite-img-speed", speed)
		}
		const render = () => {
			const naturalWidth = sizer.naturalWidth
			if naturalWidth == 0 {
				return
			}
			const tileWidth = naturalWidth * scale
			sizer.style.width = `${tileWidth}px`
			sizer.style.height = `${sizer.naturalHeight * scale}px`
			if fitAttribute {
				if track.children.length == 1 {
					return
				}
				const image = document.createElement("img")
				image.setAttribute("src", imageSource)
				image.setAttribute(fitAttribute, "")
				image.style.width = "100%"
				image.style.height = "100%"
				track.replaceChildren(image)
				track.style.width = "100%"
				return
			}

			let countPerLoop = Math.ceil((html.clientWidth || window.innerWidth) / tileWidth) + 1
			if countPerLoop % 2 != 0 {
				countPerLoop++
			}
			if track.children.length == countPerLoop * 3 {
				return
			}
			const images = []
			for let i = 0; i < countPerLoop * 3; i++ {
				const tile = document.createElement("img")
				tile.setAttribute("src", imageSource)
				if i % 2 == 1 {
					tile.style.transform = "scaleX(-1)"
				}
				tile.style.width = `${tileWidth}px`
				tile.style.height = `${sizer.naturalHeight * scale}px`
				images.push(tile)
			}
			track.replaceChildren(...images)
			html.style.setProperty("--infinite-img-loop-width", `${countPerLoop * tileWidth}px`)
		}
		sizer.addEventListener("load", render, { once: true })
		sizer.setAttribute("src", imageSource)
		render()
		html.fields.resizeObserver?.disconnect()
		html.fields.resizeObserver = new ResizeObserver(render)
		html.fields.resizeObserver.observe(html)
	},
	onDomRemove: ({ html }) => html.fields.resizeObserver?.disconnect(),
}
