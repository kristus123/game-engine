export function InjectAttributeLogicToHtml(child, methods, setState) {
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
					setState(value)
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
}
