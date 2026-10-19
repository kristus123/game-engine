export function InjectGlobalAttributeLogicToHtml() {
	const observedImages = new WeakSet()
	const hoverLogic = new GlobalHoverLogic()
	const popoverLogic = new GlobalPopoverLogic()
	const resolveBackground = node => {
		const source = node.getAttribute("bg-img")
		if !source {
			node.style.removeProperty("background-image")
			return
		}
		const path = AssetPaths.resolveImageSource(source)
		node.style.backgroundImage = `url(${JSON.stringify(path)})`
	}
	const backgroundObserver = new MutationObserver(mutations => {
		for const mutation of mutations {
			resolveBackground(mutation.target)
		}
	})
	backgroundObserver.observe(document.body, {
		attributes: true,
		attributeFilter: ["bg-img"],
		subtree: true,
	})
	HtmlObserverThing(document.body, node => {
		hoverLogic.inject(node)

		if node.hasAttribute("bg-img") {
			resolveBackground(node)
		}
		if node instanceof HTMLImageElement && !observedImages.has(node) {
			observedImages.add(node)
			const resolveSource = () => {
				const source = node.getAttribute("src")
				if source == null {
					return
				}
				const path = AssetPaths.resolveImageSource(source)
				if path != source {
					node.setAttribute("src", path)
				}
			}
			const observer = new MutationObserver(resolveSource)
			observer.observe(node, { attributes: true, attributeFilter: ["src"] })
			resolveSource()
		}

		if node.hasAttribute("contenteditable") {
			node.spellcheck = false
		}

		if node.hasAttribute("prevent-default") {
			if node.hasAttribute("contenteditable") {
				node.addEventListener("keydown", (e) => {
					if e.key == "Enter" {
						e.preventDefault()
					}
				})
			}
			else {
				throw new Error("unsupported prevent-default usage")
			}
		}

		popoverLogic.inject(node)

	})
}
