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

let offsetX = 0;
let offsetY = 0;

export class Overlay {
	static create() {
		document.getElementById('overlay').innerHTML = html

		setTimeout(() => {
			const button = document.getElementById('myButton');
				   button.addEventListener('click', () => {
					   console.log("haiahaiahihai")
			});
			
		}, 10);


		setInterval(() => {
			const button = document.getElementById('myButton');

			offsetX += 10; // Adjust these values as needed

			button.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

		}, 500)





	}

	static addTop(message) {
		setTimeout(() => {
			const div = document.createElement("div")

			div.classList.add("item");
			div.innerHTML = message
			
			document.getElementsByClassName('header')[0].appendChild(div)
			
		}, 10);
	}
}
