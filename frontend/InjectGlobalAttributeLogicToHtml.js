export function InjectGlobalAttributeLogicToHtml() {
	HtmlObserverThing(document.body, node => {

		if (node.hasAttribute("contenteditable")) {
			node.spellcheck = false
		}

		if (node.hasAttribute("prevent-default")) {
			if (node.hasAttribute("contenteditable")) {
				node.addEventListener("keydown", (e) => {
					if (e.key == "Enter") {
					   e.preventDefault()
					}
				})
			}
			else {
				throw new Error("unsupported prevent-default usage")
			}
		}

		if (node.hasAttribute("on-click-hide")) {
			node.addEventListener("click", () => {
				if (node.tag == "dialog") {
					dialog.close()
				}
				else {
					node.hide()
				}
			})
		}

		if (node.hasAttribute("on-click-show")) {
			node.addEventListener("click", () => {
				if (node.tag == "dialog") {
					dialog.showModal()
				}
				else {
					node.show()
				}
			})
		}

		const onClickShowId = node.getAttribute("on-click-show-id")
		if (onClickShowId) {
			node.addEventListener("click", () => {
				const e = Assert.value(document.getElementById(onClickShowId))
				if (e.tag == "dialog") {
					e.showModal()
				}
				else {
					e.show()
				}

			})
		}

		const onClickHideId = node.getAttribute("on-click-hide-id")
		if (onClickHideId) {
			node.addEventListener("click", () => {
				const e = Assert.value(document.getElementById(onClickHideId))
				if (e.tag == "dialog") {
					e.close()
				}
				else {
					e.hide()
				}
			})
		}
	})
}
