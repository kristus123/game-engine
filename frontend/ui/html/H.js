export class H {

	static dialog(children=[]) {

		const div = HtmlElement("div")
		for (const c of Always.list(children)) {
			div.appendChild(c)
		}

		const d = HtmlElement("dialog")
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
		const s = HtmlElement("input")

		s.type = "range"
		s.min = min
		s.max = max
		s.value = 0
		s.step=1

		return s
	}

	static input(placeholder="placeholder", onEnter=(value) => {}) {
		const i = HtmlElement("input")
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
		const p = HtmlElement("p", className)
		p.innerHTML = text

		return p
	}

	static button(text, onClick = b => {}) {
		const button = HtmlElement("button", "button")
		button.textContent = text

		button.onClick(() => {
			onClick(button)
		})

		return button
	}

}
