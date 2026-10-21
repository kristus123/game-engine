export function InjectAttributeLogicToHtml(child, methods={}, setState) {
	for const { name, value } of child.attributes {
		switch name {
			case "on-click-open-page" {
				child.listen("click", () => {
					Page.open(value)
				})
			}
			case "on-click" {
				child.listen("click", () => {
					methods[value]?.()
				})
			}
			case "on-click-set-state" {
				child.listen("click", () => {
					setState(value)
				})
			}
			case "on-enter" {
				child.onEnter(() => {
					methods[value]?.()
				})
			}
			default {
				// ignore
			}
		}
	}
}
