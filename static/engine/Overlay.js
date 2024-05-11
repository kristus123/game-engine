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

const appendLabelSelect = (parent) => {
	let element = document.createElement("option");
	element.innerHTML = "select-pack";
	element.disabled = true;
	element.selected = true;
	parent.appendChild(element);
};

const createSelect = () => {
	const footerDiv = document.querySelector(".footer .item");
	const select = document.createElement("select");
	footerDiv.appendChild(select);
	appendLabelSelect(select);
	select.className = "selector";
	return select;
};
let offsetX = 0
let offsetY = 0

export class Overlay {
	static create(camera) {
		document.getElementById('overlay').innerHTML = html
		let data = Http.get("/canvas-image");

		Overlay.handleSelectElement(data);
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

	static selectedImage = "";

	static handleSelectElement(data) {
		const select = createSelect();
		for (const key in data) {
			if (key == "path") {
				continue;
			}
			let element = document.createElement("option");
			element.innerHTML = key;
			select.appendChild(element);
		}
		select.addEventListener("change", function () {
			var selectedValue = this.value;
			Overlay.removeElement(this);
			if (selectedValue == "root") {
				Overlay.handleImageOption(data.root, data.path);
			} else {
				data[selectedValue].path = data.path + "/" + selectedValue;
				Overlay.handleSelectElement(data[selectedValue]);
			}
		});
	}

	static handleImageOption(data, path) {
		const select = createSelect();
		data.forEach((e) => {
			let element = document.createElement("option");
			element.innerHTML = e;
			select.appendChild(element);
		});
		select.addEventListener("change", function () {
			var selectedValue = this.value;
			Overlay.selectedImage = path + "/" + selectedValue;
		});
	}

	static removeElement(element) {
		var selectElements = document.querySelectorAll(`.${element.className}`);
		var selectArray = Array.from(selectElements);
		for (
			var i = selectArray.indexOf(element) + 1;
			i < selectArray.length;
			i++
		) {
			var elementToRemove = selectElements[i];
			elementToRemove.remove();
		}
	}
}
