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

let offsetX = 0
let offsetY = 0

export class Overlay {
	static create(camera) {
		document.getElementById('overlay').innerHTML = html

		setTimeout(() => {
			const button = document.getElementById('myButton')
				   button.addEventListener('click', () => {
					   console.log('haiahaiahihai')
			})

			button.addEventListener('mousedown', e => {
				e.preventDefault()
			})

		}, 10)
	}

	static update(camera) {
		const button = document.getElementById('myButton')


		offsetX = 0 - camera.position.x + (Palette.width/2)
		offsetY = 0 - camera.position.y + (Palette.height/2)

		// offsetX = 0
		// offsetY = 0


		if (button) {
				
			button.style.transform = `translate(${offsetX}px, ${offsetY}px)`
		}

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
