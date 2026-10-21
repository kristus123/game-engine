export default async ({ html }) => {
	html.setAttribute("popover", "auto")
	let active = null
	let pendingOpen = null

	const notifyPage = async (callbackName, detail) => {
		const page = Assert.value(html.closest("viking-page"))
		const options = await page.whenReady()
		options[callbackName]?.[html.id]?.(detail)
	}

	const open = ({ origin, mode, alwaysShow=false }) => {
		html.style.setProperty(
			"position-anchor",
			origin.style.getPropertyValue("anchor-name"),
		)
		active = { origin, mode, alwaysShow }

		if !html.matches(":popover-open") {
			html.setAttribute("popover", alwaysShow ? "manual" : "auto")
			html.showPopover()
		}

		if mode == "hover" {
			notifyPage("onHover", { origin, popover: html, hovering: true })
		}
		else {
			notifyPage("onClick", { origin, popover: html })
		}
		return true
	}

	html.open = options => {
		const mode = options.mode
		const alwaysShow = options.alwaysShow ?? false
		Assert.either(mode, ["hover", "click"])
		if mode == "hover" && active?.alwaysShow && html.matches(":popover-open") {
			return false
		}

		const popoverMode = alwaysShow ? "manual" : "auto"
		if html.matches(":popover-open") && html.getAttribute("popover") != popoverMode {
			pendingOpen = { ...options, alwaysShow }
			html.hidePopover()
			return true
		}

		return open({ ...options, alwaysShow })
	}

	html.close = ({ origin, mode }) => {
		Assert.either(mode, ["hover", "click"])
		if origin != active?.origin || mode != active?.mode {
			return false
		}

		if html.matches(":popover-open") {
			html.hidePopover()
		}
		return true
	}

	html.dismiss = () => {
		pendingOpen = null
		if !html.matches(":popover-open") {
			return false
		}
		html.hidePopover()
		return true
	}

	html.addEventListener("toggle", e => {
		if e.newState == "closed" {
			const closed = active
			active = null
			if closed.mode == "hover" {
				notifyPage("onHover", {
					origin: closed.origin,
					popover: html,
					hovering: false,
				})
			}
			notifyPage("onClose", { ...closed, popover: html })

			if pendingOpen {
				const options = pendingOpen
				pendingOpen = null
				open(options)
			}
		}
	})
}
