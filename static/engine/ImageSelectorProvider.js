export class ImageSelectorProvider {

	static selectedImage

	static addImageSelector() {
		const images = Http.get('/picture-library')


		const div = HtmlUtils.createElement('div', '.left', '')
		for (const imageCategory in images) {
			const b = HtmlUtils.createElement('button', div, '')
			b.style.padding = '7px'
			b.style.margin = '5px'

			b.innerHTML = imageCategory
			b.value = imageCategory

			b.addEventListener('click', () => {
				ImageSelectorProvider.previewImages(images[imageCategory])
			})
		}

		ImageSelectorProvider.previewImages(images.smoke)
	}

	static previewImages(images) {

		// HtmlUtils.removeElements('.item.image')
		var bottomDiv = document.getElementById('bottom')
		while (bottomDiv.firstChild) {
			bottomDiv.removeChild(bottomDiv.firstChild)
		}

		images.forEach(image => {

			const imgDiv = HtmlUtils.createElement('div', '.bottom', 'item image')
			imgDiv.style.background = 'white'

			const img = HtmlUtils.createElement('img', imgDiv, 'image')
			img.src = image
			img.style.maxWidth = '100%'
			img.addEventListener('click', () => {
				ImageSelectorProvider.selectedImage = image
			})
		})
	}
}
