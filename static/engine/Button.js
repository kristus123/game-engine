export class Button {
	constructor(position, text, mouse, onClick=() => {}) {
	}


	static blue(text) {

	const attributes = { tabindex: -1, class: 'button', id: 'myButton' }


	  const button = document.createElement('button');
	  button.textContent = text;
	  
	  // Set attributes
	  Object.entries(attributes).forEach(([key, value]) => {
		button.setAttribute(key, value);
	  });


		const buttons = document.getElementById('buttons')
		buttons.appendChild(button)






	   button.addEventListener('click', () => {
		   button.innerText = "xxx"
		     button.parentNode.removeChild(button)
		   })

			// button.addEventListener('mousedown', e => {
			// 	e.preventDefault()
			// })
			// }, 10)
	  
	  return button;


		
	}

	update() {
		RunOnce(this.mouse.clicking(this.position), () => {
			Call(this.onClick)
		})
	}

	draw(draw, guiDraw) {
		if (this.mouse.hovering(this.position)) {
			draw.new_rectangle(this.position, 'green')
			draw.new_text(this.position.offset(0, 70), this.text, 'white')
		}
		else {
			draw.new_rectangle(this.position, 'white')
			draw.new_text(this.position.offset(0, 70), this.text, 'grey')
		}
	}
}
