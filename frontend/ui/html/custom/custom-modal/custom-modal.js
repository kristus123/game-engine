function syncPanelStyles(html) {
	const currentStyleProperties = new Set()
	for let i = 0; i < html.style.length; i++ {
		const property = html.style[i]
		currentStyleProperties.add(property)
		html.panel.style.setProperty(property, html.style.getPropertyValue(property), html.style.getPropertyPriority(property))
	}

	for const property of html.fields.copiedStyleProperties {
		if !currentStyleProperties.has(property) {
			html.panel.style.removeProperty(property)
		}
	}
	html.fields.copiedStyleProperties = currentStyleProperties
}

function addListeners(html) {
	document.addEventListener("keydown", html.fields.onKeyDown)
	html.fields.styleObserver.observe(html, { attributes: true, attributeFilter: ["style"] })
	syncPanelStyles(html)
}

export default {
	fields: () => ({
		copiedStyleProperties: new Set(),
		onKeyDown: null,
		styleObserver: null,
	}),
	onFirstDomAdd: (html) => {
		html.show = () => {
			html.hidden = false
			html.closeButton.focus()
		}
		html.closeButton.onClick(() => html.hidden = true)
		html.backdrop.onClick(() => html.hidden = true)
		html.fields.onKeyDown = e => {
			if e.key == "Escape" && !html.hidden {
				html.hidden = true
			}
		}
		html.fields.styleObserver = new MutationObserver(() => syncPanelStyles(html))
	},
	onDomAdd: (html) => {
		addListeners(html)
	},
	onDomRemove: (html) => {
		document.removeEventListener("keydown", html.fields.onKeyDown)
		html.fields.styleObserver.disconnect()
	},
}
