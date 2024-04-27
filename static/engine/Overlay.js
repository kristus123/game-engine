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
		document.getElementById('overlay').innerHTML = html
	}

	static follow(player) {
	}
}
