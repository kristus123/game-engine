export function InjectGlobalAttributeLogicToHtml() {
	HtmlObserverThing(document.body, node => {

		if (node.hasAttribute("contenteditable")) {
			node.spellcheck = false
		}

		// Make it better later! Currently only work with contenteditable
		if (node.hasAttribute("prevent-default") && node.hasAttribute("contenteditable")) {
			node.addEventListener("keydown", (e) => {
				if (e.key == "Enter") {
				   e.preventDefault()
				}
			})
		}

		if (node.hasAttribute("on-click-hide")) {
			node.addEventListener("click", () => {
				node.hide()
			})
		}

		if (node.hasAttribute("on-click-show")) {
			node.addEventListener("click", () => {
				node.show()
			})
		}

		const onClickShowId = node.getAttribute("on-click-show-id")
		if (onClickShowId) {
			node.addEventListener("click", () => {
				const e = Assert.value(document.getElementById(onClickShowId))
				e.show()
			})
		}

		const onClickHideId = node.getAttribute("on-click-hide-id")
		if (onClickHideId) {
			node.addEventListener("click", () => {
				const e = Assert.value(document.getElementById(onClickHideId))
				e.hide()
			})
		}
	})
}
