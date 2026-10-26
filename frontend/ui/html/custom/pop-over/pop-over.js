async function notifyPage(html, callbackName, detail) {
	const page = Assert.value(html.closest("viking-page"))
	const options = await page.whenReady()
	options[callbackName]?.[html.id]?.(detail)
}

function open(html, { origin, mode, alwaysShow=false }) {
	html.style.setProperty("position-anchor", origin.style.getPropertyValue("anchor-name"))
	html.fields.active = { origin, mode, alwaysShow }

	if !html.matches(":popover-open") {
		html.setAttribute("popover", alwaysShow ? "manual" : "auto")
		html.showPopover()
	}

	if mode == "hover" {
		notifyPage(html, "onHoverShow", { origin, popover: html })
	}
	else {
		notifyPage(html, "onClick", { origin, popover: html })
	}
	return true
}

export default {
	fields: () => ({
		active: null,
		pendingOpen: null,
	}),
	onFirstDomAdd: (html) => {
		html.setAttribute("popover", "auto")
		html.open = options => {
			const mode = options.mode
			const alwaysShow = options.alwaysShow ?? false
			Assert.either(mode, ["hover", "click"])
			if mode == "hover" && html.fields.active?.alwaysShow && html.matches(":popover-open") {
				return false
			}

			const popoverMode = alwaysShow ? "manual" : "auto"
			if html.matches(":popover-open") && html.getAttribute("popover") != popoverMode {
				html.fields.pendingOpen = { ...options, alwaysShow }
				html.hidePopover()
				return true
			}
			return open(html, { ...options, alwaysShow })
		}

		html.close = ({ origin, mode }) => {
			Assert.either(mode, ["hover", "click"])
			if origin != html.fields.active?.origin || mode != html.fields.active?.mode {
				return false
			}
			if html.matches(":popover-open") {
				html.hidePopover()
			}
			return true
		}

		html.dismiss = () => {
			html.fields.pendingOpen = null
			if !html.matches(":popover-open") {
				return false
			}
			html.hidePopover()
			return true
		}

		html.addEventListener("toggle", e => {
			if e.newState == "closed" {
				const closed = html.fields.active
				html.fields.active = null
				if closed.mode == "hover" {
					notifyPage(html, "onHoverHide", { origin: closed.origin, popover: html })
				}
				notifyPage(html, "onClose", { ...closed, popover: html })

				if html.fields.pendingOpen {
					const options = html.fields.pendingOpen
					html.fields.pendingOpen = null
					open(html, options)
				}
			}
		})
	},
}
