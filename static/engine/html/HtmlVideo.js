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

export class HtmlVideo {

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
