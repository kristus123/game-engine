export class ImageSelectorProvider {
	constructor() {
		this.selectedImage = null
		const images = Http.get('/picture-library')

		const div = HtmlUtils.createElement('div', '.left', '')
		for (const category in images) {
			const button = HtmlUtils.createElement('button', div, '')
			button.style.padding = '7px'
			button.style.margin = '5px'

			button.innerHTML = category
			button.value = category

			button.addEventListener('click', () => {
				this.previewImages(images[category])
			})
		}

		this.previewImages(images.smoke)
	}

	previewImages(images) {

		HtmlUtils.removeChildElementsInId('bottom')

		images.forEach(image => {

			const imgDiv = HtmlUtils.createElement('div', '.bottom', 'item image')
			imgDiv.style.background = 'white'

			const img = HtmlUtils.createElement('img', imgDiv, 'image')
			img.src = image
			img.style.maxWidth = '100%'
			img.addEventListener('click', () => {
				this.selectedImage = image
			})
		})
	}
}
