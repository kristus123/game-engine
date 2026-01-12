export class Css {
	static fadeIn(div) {

    	div.addEventListener('animationstart', () => {
    	console.log('Fade-in started')
    	})

    	div.addEventListener('animationend', () => {
    	console.log('Fade-in ended')
    	})

    	div.classList.add('fun-pop')
    	return div
	}

}