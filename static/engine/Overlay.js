function fetchHTML() {
	const xhr = new XMLHttpRequest()
	xhr.open('GET', '/static/gui/test.html', false)
	xhr.send()

	if (xhr.status === 200) {
		const html = xhr.responseText
		return html
	}
	else {
		console.error('Error fetching HTML:', xhr.statusText)
	}

}

const html = fetchHTML()

export class Overlay {
	static create(player) {
		const div = document.createElement('div')
		div.innerHTML = html
		document.body.appendChild(div)
	}

	static follow(player) {
	}
}
