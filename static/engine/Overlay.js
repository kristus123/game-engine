function fetchHTML(path) {
	const xhr = new XMLHttpRequest()
	xhr.open('GET', path, false)
	xhr.send()

	if (xhr.status === 200) {
		const html = xhr.responseText
		return html
	}
	else {
		console.error('Error fetching HTML:', xhr.statusText)
	}
}

const overlay = fetchHTML('/static/gui/overlay.html')

export class Overlay {
	static create(camera) {
		document.getElementById('overlay').innerHTML = overlay

		this.button = new Button('hahaha', camera)
	}

	static update(camera) {
		this.button.update()
	}

	static addTop(message) {
		setTimeout(() => {
			const div = document.createElement('div')

			div.classList.add('item')
			div.innerHTML = message

			document.getElementsByClassName('header')[0].appendChild(div)

		}, 10)
	}
}
