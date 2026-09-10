export function InjectAttributeLogicToHtml(html, methods) {
	html.walk(child => {
		for (const attribute of child.attributes) {
			if (!attribute.name.includes("-")) {
				continue
			}

			const name = attribute.name
			const value = attribute.value

			switch (name) {
				case "on-click-go-page": {
					child.listen("click", () => {
						Page.go(value)
					})
				}
				case "on-click": {
					child.listen("click", () => {
						methods[value]?.()
					})
				}
				case "on-click-set-state": {
					child.listen("click", () => {
						console.log("CLICKED!")
						console.log(child)
						console.log(name)
						html.walk(c => {
							const showIf = c.getAttribute("show-if-state")

							if (showIf) {
								if (value == showIf) {
									c.show()
								}
								else {
									c.hide()
								}
							}
						})
					})
				}
				case "on-enter": {
					child.onEnter(() => {
						methods[value]?.()
					})
				}
				default: {
					// do nothing
				}
			}
		}
	})
}
