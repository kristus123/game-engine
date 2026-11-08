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
	fields: () => ({ resizeObserver: null, styleObserver: null }),
	onDomAdd: ({ html }) => {
		const track = html.querySelector(".track")
		const sizer = html.querySelector(".sizer")
		const source = Assert.string(html.getAttribute("src"))
		const imageSource = resolveSource(source)
		const fitAttribute = ["fill", "stretch", "cover", "contain"].find(attribute => html.hasAttribute(attribute))
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
			const naturalTileWidth = naturalWidth * scale
			const naturalTileHeight = sizer.naturalHeight * scale
			sizer.style.width = `${naturalTileWidth}px`
			sizer.style.height = `${naturalTileHeight}px`
			const tileWidth = fitAttribute ? html.clientWidth || window.innerWidth : naturalTileWidth
			const tileHeight = fitAttribute ? html.clientHeight || window.innerHeight : naturalTileHeight
			let countPerLoop = Math.max(1, Math.ceil((html.clientWidth || window.innerWidth) / tileWidth))
			if !fitAttribute && countPerLoop % 2 != 0 {
				countPerLoop++
			}
			const images = []
			for let i = 0; i < countPerLoop * 3; i++ {
				const tile = document.createElement("img")
				tile.setAttribute("src", imageSource)
				if fitAttribute {
					tile.setAttribute(fitAttribute, "")
				}
				if !fitAttribute && i % 2 == 1 {
					tile.style.transform = "scaleX(-1)"
				}
				tile.style.width = `${tileWidth}px`
				tile.style.height = `${tileHeight}px`
				images.push(tile)
			}
			track.replaceChildren(...images)
			const loopWidth = countPerLoop * tileWidth
			track.style.width = `${loopWidth * 3}px`
			html.style.setProperty("--infinite-img-loop-width", `${loopWidth}px`)
		}
		sizer.addEventListener("load", render, { once: true })
		sizer.setAttribute("src", imageSource)
		render()
		html.fields.resizeObserver?.disconnect()
		html.fields.resizeObserver = new ResizeObserver(render)
		html.fields.resizeObserver.observe(html)
		const updateParallaxOffset = () => {
			const loopWidth = Number.parseFloat(html.style.getPropertyValue("--infinite-img-loop-width")) || html.clientWidth || window.innerWidth
			const offset = Number.parseFloat(html.style.getPropertyValue("--infinite-img-parallax-offset")) || 0
			const normalizedOffset = -(((-offset % loopWidth) + loopWidth) % loopWidth)
			track.style.setProperty("--infinite-img-parallax-offset", `${normalizedOffset}px`)
		}
		html.fields.styleObserver?.disconnect()
		html.fields.styleObserver = new MutationObserver(updateParallaxOffset)
		html.fields.styleObserver.observe(html, { attributes: true, attributeFilter: ["style"] })
		updateParallaxOffset()
	},
	onDomRemove: ({ html }) => {
		html.fields.resizeObserver?.disconnect()
		html.fields.styleObserver?.disconnect()
	},
}
