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


function createButton(text, attributes = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    button.setAttribute(key, value);
  });


	const buttons = document.getElementById('buttons')
	buttons.appendChild(button)
  
  return button;
}


const overlay = fetchHTML('/static/gui/overlay.html')
const button = fetchHTML('/static/gui/button.html')

let offsetX = 0
let offsetY = 0

export class Overlay {
	static create(camera) {
		document.getElementById('overlay').innerHTML = overlay

		Button.blue('hahaha')
	}

	static update(camera) {
		const button = document.getElementById('myButton')

		offsetX = 0 - camera.position.x + (Palette.width/2)
		offsetY = 0 - camera.position.y + (Palette.height/2)

		// offsetX = 0
		// offsetY = 0

		if (button) {
			button.style.left = `${offsetX}px`;
			button.style.top = `${offsetY}px`;
			// button.style.transform = `translate(${offsetX}px, ${offsetY}px)`
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
