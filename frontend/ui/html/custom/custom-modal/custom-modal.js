export default async ({ html }) => {
	const panelStyleProperties = ["width", "height", "margin", "padding", "max-width", "max-height"]
	const syncPanelStyles = () => {
		for const property of panelStyleProperties {
			const value = html.style.getPropertyValue(property)
			if value {
				html.panel.style.setProperty(property, value)
			} else {
				html.panel.style.removeProperty(property)
			}
		}
	}

	html.show = () => {
		html.hidden = false
		html.closeButton.focus()
	}

	html.closeButton.onClick(() => html.hidden = true)
	html.backdrop.onClick(() => html.hidden = true)

	const onKeyDown = event => {
		if event.key == "Escape" && !html.hidden {
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
