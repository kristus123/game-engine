export class H {

	static create(name, { attributes={}, slots={}, data={} } = {}) {
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

		return e
	}

	static video(src) {
		const v = HtmlElement("video")
		v.src = src
		v.muted = true
		v.autoplay = true

		return v
	}

	static streamVideo(stream) {
		const video = document.createElement("video")

		video.autoplay = true
		video.muted = true
		video.playsInline = true

		video.srcObject = stream

		return video
	}

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
