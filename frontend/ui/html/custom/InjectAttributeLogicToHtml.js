export function InjectAttributeLogicToHtml(html, methods) {
	html.walk(child => {
		for (const attribute of child.attributes) {
			switch (attribute.name) {
				case "on-click-go-page":
					child.listen("click", () => {
						Page.go(attribute.value)
					})
				case "on-click":
					child.listen("click", () => {
						methods[attribute.value]?.()
					})
				case "on-click-set-state":
					child.listen("click", () => {
						html.walk(c => {
							const showIf = c.getAttribute("show-if-state")

							if (showIf) {
								if (showIf == attribute.value) {
									c.show()
								}
								else {
									c.hide()
								}
							}
						})
					})
				case "on-enter":
					child.onEnter(() => {
						methods[attribute.value]?.()
					})
				default: {
					// ok
				}
			}
		}
	})
}
