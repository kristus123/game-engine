export class DeathText {
	constructor(text = 'Good job!', duration = 2000) {

		if (!document.getElementById('death-text-style')) {
			const style = document.createElement('style')
			style.textContent = `
        .death {
          position:fixed;
          top:50%; left:0; transform:translateY(-50%);
          width:100%; height:120px;
          background:rgba(0,0,0,0.9);
          color:#a00;
          font-size:5rem;
          display:flex; justify-content:center; align-items:center;
          opacity:0; transition:opacity 0.3s;
        }
        .death.show { opacity:1; }
      `

			document.head.appendChild(style)
		}
	}

	show() {
		const el = HtmlElement('div', 'death show')

		el.textContent = this.text
		Html.addToScreen(el)

		setTimeout(() => {
			el.classList.remove('show')
			el.addEventListener('transitionend', () => el.remove())
		}, this.duration)
	}
}
