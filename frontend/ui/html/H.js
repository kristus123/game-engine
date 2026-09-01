function _HtmlElement(type, className="na") {
	const e = document.createElement(type)
	e.setAttribute("class", className)
	return e
}

export class H {

	static create(name, { attributes={}, slots={}, data={}, on={} } = {}) {
		const e = document.createElement(name)

		attributes.forEach((key, value) => {
			e.setAttribute(key, value)
		})

		slots.forEach((key, value) => {
			e.setAttribute("slot-" + key, value)
		})

		data.forEach((key, value) => {
			e.data[key] = value
		})

		e.onConnected = () => {
			 e.walk(child => {
				 if (child.hasAttribute("id")) {
					 e[child.getAttribute("id")] = child
				 }

				for (const attribute of child.attributes) {
					switch attribute.name {
						case "on-click" {
							child.listen("click", () => {
								on[attribute.value]?.()
							})
						}
						case "on-enter" {
							child.onEnter(() => {
								on[attribute.value]?.()
							})
						}
						default: {
							// can be ignored
						}
					}
				}
			})
		}

		return e
	}

	static _video() {
		const v = _HtmlElement("video")

		v.muted = true
		v.autoplay = true
		v.playsInline = true

		return v
	}

	static video(src) {
		const v = this._video()

		v.src = src
		v.controls = true

		return v
	}

	static streamVideo(stream) {
		const v = this._video()

		v.srcObject = stream
		v.controls = false

		return v
	}

	static dialog(children=[]) {

		const div = _HtmlElement("div")
		for (const c of Always.list(children)) {
			div.appendChild(c)
		}

		const d = _HtmlElement("dialog")
		d.appendChild(div)

		d.addEventListener("click", e => {
			if (e.target == d) {
				d.close() // close modal if clicking outside of it
			}
		})

		d.showModal()
		// make it use show() and hide()

		return d
	}

	static slider(min=1, max=100) {
		const s = _HtmlElement("input")

		s.type = "range"
		s.min = min
		s.max = max
		s.value = 0
		s.step=1

		return s
	}

	static input(placeholder="placeholder", onEnter=(value) => {}) {
		const i = _HtmlElement("input")
		i.type = "text"
		i.placeholder = placeholder

		i.listen("focus", () => {
			Controller.disabled = true
			Keyboard.disabled = true
		})

		i.listen("blur", () => {
			Controller.disabled = false
			Keyboard.disabled = false
		})

		i.listen("keydown", (e) => {
			if (e.key == "Enter") {
				onEnter(i.value)
			}
		})

		return i
	}

	static p(text, className="na") {
		const p = _HtmlElement("p", className)
		p.innerHTML = text

		return p
	}

	static button(text, onClick = b => {}) {
		const button = _HtmlElement("button", "button")
		button.textContent = text

		button.onClick(() => {
			onClick(button)
		})

		return button
	}

}
