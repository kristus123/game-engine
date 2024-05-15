export class ImageSelectorProvider {

	static #selectedImage

	static getSelectedImage() {
		return ImageSelectorProvider.#selectedImage
	}

	static addImageSelector() {
		const response = Http.get('/picture-library')
		this.createImageSelector(response, '.footer')
	}

	static createImageSelector(imageData, parentClass) {

		const selectDiv = HtmlUtils.createElement('div', parentClass, 'item')
		const select = HtmlUtils.createElement('select', selectDiv, 'selector')
		select.value = ''

		for (const key in imageData) {
			let element = HtmlUtils.createElement('option', select)
			element.innerHTML = key
			element.value = key
		}

		select.addEventListener('change', function () {
			let selectedValue = this.value
			let options = imageData[selectedValue]
			ImageSelectorProvider.createImageOption(options, selectedValue)
		})

	}


	static createImageOption(images) {

		HtmlUtils.removeElements('.item.image')

		images.forEach((e) => {

			const imgDiv = HtmlUtils.createElement('div', '.footer', 'item image')
			const img = HtmlUtils.createElement('img', imgDiv, 'image')

			const imagePath = e
			img.src = imagePath

			imgDiv.style.background = 'green'
			img.style.maxWidth = '100%'

			img.addEventListener('click', function () {
				ImageSelectorProvider.#selectedImage = this.src
			})

			// Handle image loading error
			img.onerror = function () {
				imgDiv.remove()
			}

		})
	}
}
