export default async ({ html }) => {
	let copiedStyleProperties = new Set()
	const syncPanelStyles = () => {
		const currentStyleProperties = new Set()
		for let i = 0; i < html.style.length; i++ {
			const property = html.style[i]
			currentStyleProperties.add(property)
			html.panel.style.setProperty(property, html.style.getPropertyValue(property), html.style.getPropertyPriority(property))
		}

		for const property of copiedStyleProperties {
			if !currentStyleProperties.has(property) {
				html.panel.style.removeProperty(property)
			}
		}

		copiedStyleProperties = currentStyleProperties
	}

	html.show = () => {
		html.hidden = false
		html.closeButton.focus()
	}

	html.closeButton.onClick(() => html.hidden = true)
	html.backdrop.onClick(() => html.hidden = true)

	const onKeyDown = e => {
		if e.key == "Escape" && !html.hidden {
			html.hidden = true
		}
	}
	const addKeyListener = () => document.addEventListener("keydown", onKeyDown)
	const removeKeyListener = () => document.removeEventListener("keydown", onKeyDown)

	const styleObserver = new MutationObserver(syncPanelStyles)
	const addStyleObserver = () => {
		styleObserver.observe(html, { attributes: true, attributeFilter: ["style"] })
		syncPanelStyles()
	}
	const removeStyleObserver = () => styleObserver.disconnect()
	addKeyListener()
	addStyleObserver()

	return {
		onDomAdd: () => {
			addKeyListener()
			addStyleObserver()
		},
		onDomRemove: () => {
			removeKeyListener()
			removeStyleObserver()
		},
	}
}
