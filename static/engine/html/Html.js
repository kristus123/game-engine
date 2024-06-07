function element(type, clazz) {
	const e = document.createElement(type)
	e.setAttribute('class', clazz)
	e.setAttribute('tabindex', -1)

	// document.getElementById('ui_elements').appendChild(e)

	e.addEventListener('mousedown', e => {
		e.preventDefault()
	})

	return e
}

export class Html {

	static div(text) {
		var div = document.createElement("div");

		div.appendChild(document.createTextNode(text))

		return div
	}

	static button(text, onClick) {
		const button = element('button', 'ui button')
		button.textContent = text

		button.addEventListener('click', () => {
			onClick(button)
		})

		document.getElementById('ui_elements').appendChild(button)
		return button
	}

	static text(text) {
		const p = element('p', 'ui')
		p.textContent = text
		p.style.fontSize = '100px'

		document.getElementById('ui_elements').appendChild(p)

		return {
			style: p.style,
			text: text => {
				p.textContent = text
				return this
			},
			position: p => {
				p.style.left = `${p.x}px`
				p.style.top = `${p.y}px`
				return this
			}
		}
	}

	static remove(e) {
		e.parentNode.removeChild(e)
	}

	static removeChildElementsInId(id) {
		var bottomDiv = document.getElementById(id)
		while (bottomDiv.firstChild) {
			bottomDiv.removeChild(bottomDiv.firstChild)
		}
	}

	static createElement(element, parent, className) {
		// check if parent argument is a "string" or HTMLelement
		const parentElement = parent instanceof HTMLElement ? parent : document.querySelector(parent)
		const newElement = document.createElement(element)

		newElement.className = className

		parentElement.appendChild(newElement)
		return newElement
	}

	static localVideo(srcObject) {
		const local_video = element('video', 'LocalVideo')
		const div = element('div', '')
		const h3 = element('h3', '')
		h3.innerText = 'You'
		local_video.autoplay = true
		local_video.muted = true
		local_video.srcObject = srcObject
		document.getElementById('videocallrtc').appendChild(div)
		div.appendChild(local_video)
		div.appendChild(h3)
		return local_video
	}

	static guestVideo(srcObject, guestId) {
		const guest_video = element('video', 'GuestVideo')
		const div = element('div', '')
		const h3 = element('h3', '')
		h3.innerText = guestId
		div.id = guestId
		guest_video.autoplay = true
		guest_video.srcObject = srcObject
		document.getElementById('videocallrtc').appendChild(div)
		div.appendChild(guest_video)
		div.appendChild(h3)
		return guest_video
	}
}
